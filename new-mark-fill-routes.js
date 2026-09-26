/*
============================================================
NEW BULK MARK ENTRY ROUTES
============================================================

IMPORTANT:
This code is designed to be added to your EXISTING
marksheet router file.

Your existing file already contains:
    const marksheet = express.Router()
    const studentlist = require('../models/studentlist.js')
    const classModels = {...}
    const marksModels = {...}
    function getMarksModel(className, examType) {...}

Do NOT redeclare those variables.

Add the code below BEFORE:
    module.exports = marksheet;

URL:
    If your marksheet router is mounted at "/marksheet":
        /marksheet/new/mark-fill

    If it is mounted at "/":
        /new/mark-fill
============================================================
*/

const NEW_MARK_EXAMS = {
    I: [
        { key: "PT1", label: "PT-1", max: 10 },
        { key: "PT2", label: "PT-2", max: 10 },
        { key: "Halfyearly", label: "Halfyearly", max: 80 }
    ],
    II: [
        { key: "PT3", label: "PT-3", max: 10 },
        { key: "PT4", label: "PT-4", max: 10 },
        { key: "Annual", label: "Annual", max: 80 }
    ]
};

const NEW_MARK_CLASSES = [
    "Nursery", "LKG", "UKG",
    "1", "2", "3", "4", "5", "6", "7", "8"
];

function newMarkClassLabel(className) {
    if (["Nursery", "LKG", "UKG"].includes(String(className))) {
        return String(className);
    }

    return `Class ${className}`;
}

function newMarkExamModels(className, term) {
    const models = classModels[String(className)];

    if (!models) return null;

    if (term === "I") {
        return [
            { key: "PT1", label: "PT-1", max: 10, Model: models.PT1 },
            { key: "PT2", label: "PT-2", max: 10, Model: models.PT2 },
            { key: "Halfyearly", label: "Halfyearly", max: 80, Model: models.Halfyearly }
        ];
    }

    if (term === "II") {
        return [
            { key: "PT3", label: "PT-3", max: 10, Model: models.PT3 },
            { key: "PT4", label: "PT-4", max: 10, Model: models.PT4 },
            { key: "Annual", label: "Annual", max: 80, Model: models.Annual }
        ];
    }

    return null;
}

function newMarkHumanize(value) {
    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function newMarkGetSubjectOptions(className) {
    const models = classModels[String(className)];

    if (!models) return [];

    const fields = new Set();

    Object.values(models).forEach(Model => {
        if (!Model || !Model.schema || !Model.schema.paths) return;

        Object.keys(Model.schema.paths).forEach(path => {
            if (
                ![
                    "_id",
                    "__v",
                    "name",
                    "rollNumber",
                    "admissionNumber",
                    "class",
                    "examType",
                    "createdAt",
                    "updatedAt"
                ].includes(path)
            ) {
                fields.add(path);
            }
        });
    });

    return [...fields]
        .sort()
        .map(value => ({
            value,
            label: newMarkHumanize(value)
        }));
}

/*
------------------------------------------------------------
GET /new/mark-fill
------------------------------------------------------------
*/
marksheet.route("/new/mark-fill").get(async (req, res) => {

    try {

        const subjectsByClass = {};

        for (const className of NEW_MARK_CLASSES) {
            subjectsByClass[className] =
                newMarkGetSubjectOptions(className);
        }

        return res.render("newMarkFill.ejs", {
            subjectsByClass,
            error: null,
            success:
                String(req.query.success || "") === "1"
        });

    } catch (error) {

        console.error(
            "NEW MARK FILL PAGE ERROR:",
            error
        );

        return res.status(500).send(
            "Unable to open mark fill page."
        );
    }
});

/*
------------------------------------------------------------
POST /new/mark-fill/load

Loads ALL students for selected class and ALL exam columns
belonging to the selected term.

No student details are editable.
------------------------------------------------------------
*/
marksheet.route("/new/mark-fill/load").post(async (req, res) => {

    try {

        const className =
            String(req.body.className || "").trim();

        const term =
            String(req.body.term || "").trim();

        const subject =
            String(req.body.subject || "").trim();

        if (!NEW_MARK_CLASSES.includes(className)) {
            return res.status(400).send(
                "Invalid class."
            );
        }

        if (!["I", "II"].includes(term)) {
            return res.status(400).send(
                "Invalid term."
            );
        }

        const examConfigs =
            newMarkExamModels(className, term);

        if (!examConfigs) {
            return res.status(400).send(
                "No examination configuration found."
            );
        }

        const validSubjects =
            newMarkGetSubjectOptions(className)
                .map(item => item.value);

        if (!validSubjects.includes(subject)) {
            return res.status(400).send(
                "Invalid subject."
            );
        }

        /*
        --------------------------------------------------------
        GET MASTER STUDENT LIST

        Your existing studentlist uses:
            studentName
            admissionNo
            rollNo
            house

        Class is derived from house:
            STD-8 -> 8
        --------------------------------------------------------
        */

        const houseValues = [
            className,
            `STD-${className}`
        ];

        const masterStudents =
            await studentlist
                .find({
                    house: {
                        $in: houseValues
                    }
                })
                .lean();

        /*
        --------------------------------------------------------
        If the class is Nursery/LKG/UKG, the exact house value
        is used. For numbered classes we also support STD-X.
        --------------------------------------------------------
        */

        const uniqueStudents = new Map();

        for (const student of masterStudents) {

            const admissionNumber =
                String(
                    student.admissionNo || ""
                ).trim();

            if (!admissionNumber) continue;

            if (!uniqueStudents.has(admissionNumber)) {

                uniqueStudents.set(
                    admissionNumber,
                    {
                        name:
                            student.studentName || "",
                        rollNumber:
                            student.rollNo ?? "",
                        admissionNumber
                    }
                );
            }
        }

        /*
        --------------------------------------------------------
        FALLBACK:

        If studentlist has no class rows, build the unique
        student list from the existing exam collections.

        This is useful for older data where studentlist and
        marks collections are not perfectly synchronized.
        --------------------------------------------------------
        */

        if (uniqueStudents.size === 0) {

            for (const exam of examConfigs) {

                const rows =
                    await exam.Model
                        .find({})
                        .select(
                            "name rollNumber admissionNumber"
                        )
                        .lean();

                for (const row of rows) {

                    const admissionNumber =
                        String(
                            row.admissionNumber || ""
                        ).trim();

                    if (!admissionNumber) continue;

                    if (!uniqueStudents.has(admissionNumber)) {

                        uniqueStudents.set(
                            admissionNumber,
                            {
                                name:
                                    row.name || "",
                                rollNumber:
                                    row.rollNumber ?? "",
                                admissionNumber
                            }
                        );
                    }
                }
            }
        }

        const students =
            [...uniqueStudents.values()]
                .sort((a, b) => {

                    const rollA =
                        Number(a.rollNumber);

                    const rollB =
                        Number(b.rollNumber);

                    if (
                        Number.isFinite(rollA) &&
                        Number.isFinite(rollB)
                    ) {
                        return rollA - rollB;
                    }

                    return String(a.name)
                        .localeCompare(
                            String(b.name)
                        );
                });

        /*
        --------------------------------------------------------
        LOAD EXISTING MARKS

        Each exam is a separate MongoDB collection/model.
        --------------------------------------------------------
        */

        const marksByExam =
            {};

        for (const exam of examConfigs) {

            const documents =
                await exam.Model
                    .find({
                        admissionNumber: {
                            $in:
                                students.map(
                                    student =>
                                        student.admissionNumber
                                )
                        }
                    })
                    .select(
                        `admissionNumber ${subject}`
                    )
                    .lean();

            marksByExam[exam.key] =
                new Map(
                    documents.map(document => [
                        String(
                            document.admissionNumber
                        ),
                        document[subject]
                    ])
                );
        }

        /*
        --------------------------------------------------------
        COMBINE STUDENTS + EXISTING MARKS
        --------------------------------------------------------
        */

        const finalStudents =
            students.map(student => {

                const marks = {};

                for (const exam of examConfigs) {

                    const value =
                        marksByExam[exam.key]
                            ?.get(
                                student.admissionNumber
                            );

                    marks[exam.key] =
                        value === undefined ||
                        value === null
                            ? ""
                            : value;
                }

                return {
                    ...student,
                    marks
                };
            });

        return res.render(
            "newMarkFillStudents.ejs",
            {
                className,
                classLabel:
                    newMarkClassLabel(className),

                term,
                termLabel:
                    term === "I"
                        ? "Term I"
                        : "Term II",

                subject,
                subjectLabel:
                    newMarkHumanize(subject),

                exams:
                    examConfigs.map(exam => ({
                        key: exam.key,
                        label: exam.label,
                        max: exam.max
                    })),

                ptMax: 10,
                finalMax: 80,

                students:
                    finalStudents
            }
        );

    } catch (error) {

        console.error(
            "NEW MARK LOAD ERROR:",
            error
        );

        return res.status(500).send(
            "Unable to load students and marks."
        );
    }
});

/*
------------------------------------------------------------
POST /new/mark-fill/save

IMPORTANT BEHAVIOUR:

1. Blank input = DO NOT CHANGE EXISTING MARK.
2. 0 = VALID MARK and WILL BE SAVED.
3. Only the selected subject is changed.
4. Student identity fields are never changed.
5. PT-1/PT-2/Halfyearly or PT-3/PT-4/Annual are stored
   in their existing separate models.
------------------------------------------------------------
*/
marksheet.route("/new/mark-fill/save").post(async (req, res) => {

    try {

        const className =
            String(req.body.className || "").trim();

        const term =
            String(req.body.term || "").trim();

        const subject =
            String(req.body.subject || "").trim();

        if (!NEW_MARK_CLASSES.includes(className)) {
            return res.status(400).send(
                "Invalid class."
            );
        }

        if (!["I", "II"].includes(term)) {
            return res.status(400).send(
                "Invalid term."
            );
        }

        const examConfigs =
            newMarkExamModels(className, term);

        if (!examConfigs) {
            return res.status(400).send(
                "Invalid term configuration."
            );
        }

        const validSubjects =
            newMarkGetSubjectOptions(className)
                .map(item => item.value);

        if (!validSubjects.includes(subject)) {
            return res.status(400).send(
                "Invalid subject."
            );
        }

        const marks =
            req.body.marks || {};

        let updatedCount = 0;

        /*
        --------------------------------------------------------
        marks is expected as:

        marks[0][PT1]
        marks[0][PT2]
        marks[0][Halfyearly]

        The index is only used to connect the form rows.
        Admission number is separately posted below through
        the hidden row data generated by this route.

        Because we don't want to trust an editable student
        identity field, we load the student list again below.
        --------------------------------------------------------
        */

        const masterStudents =
            await studentlist
                .find({
                    house: {
                        $in: [
                            className,
                            `STD-${className}`
                        ]
                    }
                })
                .lean();

        const uniqueStudents = new Map();

        for (const student of masterStudents) {

            const admissionNumber =
                String(
                    student.admissionNo || ""
                ).trim();

            if (!admissionNumber) continue;

            if (!uniqueStudents.has(admissionNumber)) {

                uniqueStudents.set(
                    admissionNumber,
                    {
                        name:
                            student.studentName || "",
                        rollNumber:
                            student.rollNo ?? "",
                        admissionNumber
                    }
                );
            }
        }

        /*
        --------------------------------------------------------
        Fallback to existing exam collections if needed.
        --------------------------------------------------------
        */

        if (uniqueStudents.size === 0) {

            for (const exam of examConfigs) {

                const rows =
                    await exam.Model
                        .find({})
                        .select(
                            "name rollNumber admissionNumber"
                        )
                        .lean();

                for (const row of rows) {

                    const admissionNumber =
                        String(
                            row.admissionNumber || ""
                        ).trim();

                    if (!admissionNumber) continue;

                    if (!uniqueStudents.has(admissionNumber)) {

                        uniqueStudents.set(
                            admissionNumber,
                            {
                                name:
                                    row.name || "",
                                rollNumber:
                                    row.rollNumber ?? "",
                                admissionNumber
                            }
                        );
                    }
                }
            }
        }

        const students =
            [...uniqueStudents.values()]
                .sort((a, b) => {

                    const rollA =
                        Number(a.rollNumber);

                    const rollB =
                        Number(b.rollNumber);

                    if (
                        Number.isFinite(rollA) &&
                        Number.isFinite(rollB)
                    ) {
                        return rollA - rollB;
                    }

                    return String(a.name)
                        .localeCompare(
                            String(b.name)
                        );
                });

        /*
        --------------------------------------------------------
        UPDATE EACH EXAM MODEL

        We only update NON-BLANK values.

        Therefore:

        existing PT1 = 8
        submitted PT1 = ""

        => PT1 remains 8

        existing PT1 = 8
        submitted PT1 = 9

        => PT1 becomes 9

        submitted PT1 = 0

        => PT1 becomes 0
        --------------------------------------------------------
        */

        for (
            let index = 0;
            index < students.length;
            index++
        ) {

            const student =
                students[index];

            const rowMarks =
                marks[index] || {};

            for (const exam of examConfigs) {

                const rawValue =
                    rowMarks[exam.key];

                /*
                Blank means:
                DO NOT MODIFY THIS EXAM MARK.
                */
                if (
                    rawValue === undefined ||
                    rawValue === null ||
                    String(rawValue).trim() === ""
                ) {
                    continue;
                }

                const numericValue =
                    Number(rawValue);

                if (
                    !Number.isInteger(
                        numericValue
                    ) ||
                    numericValue < 0 ||
                    numericValue > exam.max
                ) {
                    return res.status(400).send(
                        `Invalid ${exam.label} marks for ${student.name}. Maximum is ${exam.max}.`
                    );
                }

                const schemaPaths =
                    Object.keys(
                        exam.Model.schema.paths
                    );

                if (
                    !schemaPaths.includes(subject)
                ) {
                    return res.status(400).send(
                        `Subject "${subject}" is not available in ${exam.label}.`
                    );
                }

                /*
                ------------------------------------------------
                Update existing document.

                If no document exists, create a minimal one
                containing the same identity fields used by the
                existing marks system.
                ------------------------------------------------
                */

                const existing =
                    await exam.Model.findOne({
                        admissionNumber:
                            student.admissionNumber
                    });

                if (existing) {

                    await exam.Model.updateOne(
                        {
                            admissionNumber:
                                student.admissionNumber
                        },
                        {
                            $set: {
                                [subject]:
                                    numericValue
                            }
                        }
                    );

                } else {

                    const newDocument = {
                        admissionNumber:
                            student.admissionNumber,

                        name:
                            student.name,

                        rollNumber:
                            student.rollNumber,

                        class:
                            className,

                        examType:
                            exam.key,

                        [subject]:
                            numericValue
                    };

                    await exam.Model.create(
                        newDocument
                    );
                }

                updatedCount++;
            }
        }

        /*
        --------------------------------------------------------
        Return to the same subject/term page.

        This lets the teacher immediately see the saved values.
        --------------------------------------------------------
        */

        return res.redirect(
            `/new/mark-fill?success=1`
        );

    } catch (error) {

        console.error(
            "NEW MARK SAVE ERROR:",
            error
        );

        return res.status(500).send(
            "Unable to save marks."
        );
    }
});
