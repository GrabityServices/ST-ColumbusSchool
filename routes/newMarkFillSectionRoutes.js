/*
===========================================================
NEW MARK FILL - SECTION WISE ROUTES
===========================================================

Add this file:

routes/newMarkFillSectionRoutes.js

Then in routes/marksheet.js, BEFORE:

module.exports = marksheet;

add:

const registerNewMarkFillRoutes =
    require("./newMarkFillSectionRoutes");

registerNewMarkFillRoutes({
    marksheet,
    studentlist,
    classModels
});

===========================================================
*/

module.exports = function registerNewMarkFillRoutes({
    marksheet,
    studentlist,
    classModels
}) {

    if (!marksheet) {
        throw new Error(
            "newMarkFillSectionRoutes: marksheet router is required."
        );
    }

    if (!studentlist) {
        throw new Error(
            "newMarkFillSectionRoutes: studentlist model is required."
        );
    }

    if (!classModels) {
        throw new Error(
            "newMarkFillSectionRoutes: classModels is required."
        );
    }


    /*
    ===========================================================
    CLASSES
    ===========================================================
    */

    const CLASSES = [
        "Nursery",
        "LKG",
        "UKG",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8"
    ];


    /*
    ===========================================================
    CLASS LABEL
    ===========================================================
    */

    function classLabel(className) {

        if (
            ["Nursery", "LKG", "UKG"]
                .includes(String(className))
        ) {
            return String(className);
        }

        return `Class ${className}`;
    }


    /*
    ===========================================================
    HUMANIZE SUBJECT
    ===========================================================
    */

    function humanize(value) {

        return String(value)
            .replace(
                /([a-z])([A-Z])/g,
                "$1 $2"
            )
            .replace(
                /[_-]+/g,
                " "
            )
            .replace(
                /\b\w/g,
                char => char.toUpperCase()
            );
    }


    /*
    ===========================================================
    EXAM CONFIGURATION
    ===========================================================
    */

    function getExams(className, term) {

        const models =
            classModels[String(className)];


        if (!models) {
            return null;
        }


        /*
        TERM I

        PT-1
        PT-2
        Halfyearly
        */

        if (term === "I") {

            return [

                {
                    key: "PT1",
                    label: "PT-1",
                    max: 10,
                    Model: models.PT1
                },

                {
                    key: "PT2",
                    label: "PT-2",
                    max: 10,
                    Model: models.PT2
                },

                {
                    key: "Halfyearly",
                    label: "Halfyearly",
                    max: 80,
                    Model: models.Halfyearly
                }

            ];
        }


        /*
        TERM II

        PT-3
        PT-4
        Annual
        */

        if (term === "II") {

            return [

                {
                    key: "PT3",
                    label: "PT-3",
                    max: 10,
                    Model: models.PT3
                },

                {
                    key: "PT4",
                    label: "PT-4",
                    max: 10,
                    Model: models.PT4
                },

                {
                    key: "Annual",
                    label: "Annual",
                    max: 80,
                    Model: models.Annual
                }

            ];
        }


        return null;
    }


    /*
    ===========================================================
    SUBJECT LIST
    ===========================================================
    */

    function getSubjects(className) {

        const models =
            classModels[String(className)];


        if (!models) {
            return [];
        }


        const fields = new Set();


        Object.values(models).forEach(Model => {

            if (
                !Model ||
                !Model.schema ||
                !Model.schema.paths
            ) {
                return;
            }


            Object.keys(
                Model.schema.paths
            ).forEach(path => {

                /*
                Fields which are NOT subjects
                */

                if (
                    [
                        "_id",
                        "__v",
                        "name",
                        "rollNumber",
                        "admissionNumber",
                        "class",
                        "className",
                        "section",
                        "examType",
                        "createdAt",
                        "updatedAt"
                    ].includes(path)
                ) {
                    return;
                }


                fields.add(path);

            });

        });


        return [...fields]
            .sort()
            .map(value => ({
                value: value,
                label: humanize(value)
            }));
    }


    /*
    ===========================================================
    GET STUDENTS
    ===========================================================

    PRIMARY SOURCE:

    Student model:

        className
        section
        rollNo
        studentName
        admissionNo

    IMPORTANT:

    Roll number is NOT unique across sections.

    Example:

    A - Roll 1
    A - Roll 2

    B - Roll 1
    B - Roll 2

    Admission number is used as unique identity.
    ===========================================================
    */

    async function getStudents(
        className,
        examConfigs
    ) {

        const classValues = [

            String(className),

            `Class ${className}`,

            `STD-${className}`

        ];


        /*
        -------------------------------------------------------
        LOAD FROM STUDENT COLLECTION
        -------------------------------------------------------
        */

        const studentRows =
            await studentlist
                .find({
                    $or: [

                        {
                            className: {
                                $in: classValues
                            }
                        },

                        /*
                        Old records may use house
                        for class information.
                        */

                        {
                            house: {
                                $in: classValues
                            }
                        }

                    ]
                })
                .lean();


        const uniqueStudents =
            new Map();


        /*
        -------------------------------------------------------
        CREATE UNIQUE STUDENT LIST
        -------------------------------------------------------
        */

        studentRows.forEach(student => {

            const admissionNumber =
                String(
                    student.admissionNo || ""
                ).trim();


            if (!admissionNumber) {
                return;
            }


            /*
            Admission number is unique identity.
            */

            if (
                uniqueStudents.has(
                    admissionNumber
                )
            ) {
                return;
            }


            uniqueStudents.set(
                admissionNumber,
                {

                    name:
                        String(
                            student.studentName || ""
                        ).trim(),

                    rollNumber:
                        student.rollNo ?? "",

                    admissionNumber:

                        admissionNumber,

                    section:

                        String(
                            student.section || ""
                        )
                        .trim()
                        .toUpperCase()

                }
            );

        });


        /*
        -------------------------------------------------------
        FALLBACK
        -------------------------------------------------------

        Only used when Student collection has no
        matching students.

        This prevents accidental mixing of classes.
        -------------------------------------------------------
        */

        if (
            uniqueStudents.size === 0
        ) {

            for (
                const exam
                of examConfigs
            ) {

                if (!exam.Model) {
                    continue;
                }


                const rows =
                    await exam.Model
                        .find({
                            $or: [

                                {
                                    class: {
                                        $in:
                                            classValues
                                    }
                                },

                                {
                                    className: {
                                        $in:
                                            classValues
                                    }
                                }

                            ]
                        })
                        .select(
                            "name rollNumber admissionNumber section class className"
                        )
                        .lean();


                rows.forEach(row => {

                    const admissionNumber =
                        String(
                            row.admissionNumber || ""
                        ).trim();


                    if (
                        !admissionNumber
                    ) {
                        return;
                    }


                    if (
                        uniqueStudents.has(
                            admissionNumber
                        )
                    ) {
                        return;
                    }


                    uniqueStudents.set(
                        admissionNumber,
                        {

                            name:
                                String(
                                    row.name || ""
                                ).trim(),

                            rollNumber:
                                row.rollNumber ?? "",

                            admissionNumber:
                                admissionNumber,

                            section:
                                String(
                                    row.section || ""
                                )
                                .trim()
                                .toUpperCase()

                        }
                    );

                });

            }

        }


        /*
        -------------------------------------------------------
        SORT

        Section first
        Roll number second
        Name third
        -------------------------------------------------------
        */

        return [
            ...uniqueStudents.values()
        ].sort((a, b) => {

            const sectionA =
                String(
                    a.section || ""
                )
                .trim()
                .toUpperCase();

            const sectionB =
                String(
                    b.section || ""
                )
                .trim()
                .toUpperCase();


            /*
            Empty section goes last.
            */

            if (
                sectionA === "" &&
                sectionB !== ""
            ) {
                return 1;
            }


            if (
                sectionA !== "" &&
                sectionB === ""
            ) {
                return -1;
            }


            /*
            Compare sections.
            */

            const sectionCompare =
                sectionA.localeCompare(
                    sectionB,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                );


            if (
                sectionCompare !== 0
            ) {
                return sectionCompare;
            }


            /*
            Same section:
            compare roll number.
            */

            const rollA =
                Number(a.rollNumber);

            const rollB =
                Number(b.rollNumber);


            if (
                Number.isFinite(rollA) &&
                Number.isFinite(rollB)
            ) {

                if (
                    rollA !== rollB
                ) {
                    return rollA - rollB;
                }

            }


            /*
            Final fallback:
            student name.
            */

            return String(
                a.name || ""
            ).localeCompare(
                String(
                    b.name || ""
                ),
                undefined,
                {
                    sensitivity: "base"
                }
            );

        });

    }


    /*
    ===========================================================
    GET /new/mark-fill
    ===========================================================
    */

    marksheet
        .route("/new/mark-fill")
        .get(async (req, res) => {

            try {

                const subjectsByClass = {};


                for (
                    const className
                    of CLASSES
                ) {

                    subjectsByClass[
                        className
                    ] =
                        getSubjects(
                            className
                        );

                }


                return res.render(
                    "newMarkFill.ejs",
                    {

                        subjectsByClass,

                        error: null,

                        success:
                            String(
                                req.query.success || ""
                            ) === "1"

                    }
                );

            }
            catch (error) {

                console.error(
                    "NEW MARK FILL PAGE ERROR:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to open mark fill page."
                    );

            }

        });


    /*
    ===========================================================
    POST /new/mark-fill/load
    ===========================================================
    */

    marksheet
        .route("/new/mark-fill/load")
        .post(async (req, res) => {

            try {

                console.log(
                    "NEW MARK LOAD:",
                    req.body
                );


                const className =
                    String(
                        req.body.className || ""
                    ).trim();


                const term =
                    String(
                        req.body.term || ""
                    ).trim();


                const subject =
                    String(
                        req.body.subject || ""
                    ).trim();


                /*
                Validate class.
                */

                if (
                    !CLASSES.includes(
                        className
                    )
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid class."
                        );

                }


                /*
                Validate term.
                */

                if (
                    ![
                        "I",
                        "II"
                    ].includes(term)
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid term."
                        );

                }


                /*
                Get exams.
                */

                const exams =
                    getExams(
                        className,
                        term
                    );


                if (!exams) {

                    return res
                        .status(400)
                        .send(
                            "No examination configuration found."
                        );

                }


                /*
                Validate subject.
                */

                const validSubjects =
                    getSubjects(
                        className
                    )
                    .map(
                        item =>
                            item.value
                    );


                if (
                    !validSubjects.includes(
                        subject
                    )
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid subject."
                        );

                }


                /*
                Get section-wise students.
                */

                const students =
                    await getStudents(
                        className,
                        exams
                    );


                /*
                ------------------------------------------------
                LOAD EXISTING MARKS
                ------------------------------------------------
                */

                const markMaps = {};


                for (
                    const exam
                    of exams
                ) {

                    markMaps[
                        exam.key
                    ] = new Map();


                    if (
                        !exam.Model ||
                        students.length === 0
                    ) {
                        continue;
                    }


                    const documents =
                        await exam.Model
                            .find({
                                admissionNumber: {
                                    $in:
                                        students.map(
                                            student =>
                                                student
                                                    .admissionNumber
                                        )
                                }
                            })
                            .select(
                                `admissionNumber ${subject}`
                            )
                            .lean();


                    documents.forEach(
                        document => {

                            markMaps[
                                exam.key
                            ].set(

                                String(
                                    document
                                        .admissionNumber
                                ),

                                document[
                                    subject
                                ]

                            );

                        }
                    );

                }


                /*
                ------------------------------------------------
                ADD MARKS TO STUDENTS
                ------------------------------------------------
                */

                const finalStudents =
                    students.map(
                        student => {

                            const marks = {};


                            exams.forEach(
                                exam => {

                                    const value =
                                        markMaps[
                                            exam.key
                                        ]?.get(
                                            student
                                                .admissionNumber
                                        );


                                    marks[
                                        exam.key
                                    ] =
                                        value ===
                                            undefined ||
                                        value ===
                                            null
                                            ? ""
                                            : value;

                                }
                            );


                            return {

                                ...student,

                                marks

                            };

                        }
                    );


                /*
                ------------------------------------------------
                RENDER
                ------------------------------------------------
                */

                return res.render(
                    "newMarksFillStudent-Section.ejs",
                    {

                        className,

                        classLabel:
                            classLabel(
                                className
                            ),

                        term,

                        termLabel:
                            term === "I"
                                ? "Term I"
                                : "Term II",

                        subject,

                        subjectLabel:
                            humanize(
                                subject
                            ),

                        exams:
                            exams.map(
                                exam => ({

                                    key:
                                        exam.key,

                                    label:
                                        exam.label,

                                    max:
                                        exam.max

                                })
                            ),

                        ptMax: 10,

                        finalMax: 80,

                        students:
                            finalStudents

                    }
                );

            }
            catch (error) {

                console.error(
                    "NEW MARK LOAD ERROR:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to load students and marks."
                    );

            }

        });


    /*
    ===========================================================
    POST /new/mark-fill/save
    ===========================================================
    */

    marksheet
        .route("/new/mark-fill/save")
        .post(async (req, res) => {

            try {

                const className =
                    String(
                        req.body.className || ""
                    ).trim();


                const term =
                    String(
                        req.body.term || ""
                    ).trim();


                const subject =
                    String(
                        req.body.subject || ""
                    ).trim();


                /*
                Validate.
                */

                if (
                    !CLASSES.includes(
                        className
                    )
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid class."
                        );

                }


                if (
                    ![
                        "I",
                        "II"
                    ].includes(term)
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid term."
                        );

                }


                const exams =
                    getExams(
                        className,
                        term
                    );


                if (!exams) {

                    return res
                        .status(400)
                        .send(
                            "Invalid exam configuration."
                        );

                }


                const validSubjects =
                    getSubjects(
                        className
                    )
                    .map(
                        item =>
                            item.value
                    );


                if (
                    !validSubjects.includes(
                        subject
                    )
                ) {

                    return res
                        .status(400)
                        .send(
                            "Invalid subject."
                        );

                }


                /*
                Get students again from DB.
                */

                const students =
                    await getStudents(
                        className,
                        exams
                    );


                const marks =
                    req.body.marks || {};


                let savedCount = 0;


                /*
                ------------------------------------------------
                SAVE EACH STUDENT
                ------------------------------------------------
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


                    /*
                    Each exam.
                    */

                    for (
                        const exam
                        of exams
                    ) {

                        const rawValue =
                            rowMarks[
                                exam.key
                            ];


                        /*
                        Blank means:
                        DO NOTHING.
                        */

                        if (
                            rawValue ===
                                undefined ||
                            rawValue ===
                                null ||
                            String(
                                rawValue
                            ).trim() === ""
                        ) {

                            continue;

                        }


                        const value =
                            Number(
                                rawValue
                            );


                        /*
                        Validate marks.
                        */

                        if (
                            !Number.isInteger(
                                value
                            ) ||
                            value < 0 ||
                            value > exam.max
                        ) {

                            return res
                                .status(400)
                                .send(

                                    `Invalid ${exam.label} marks for ${student.name}. Maximum is ${exam.max}.`

                                );

                        }


                        /*
                        Verify subject exists.
                        */

                        if (
                            !exam.Model ||
                            !exam.Model.schema ||
                            !exam.Model.schema.paths ||
                            !Object.prototype
                                .hasOwnProperty
                                .call(
                                    exam.Model
                                        .schema
                                        .paths,
                                    subject
                                )
                        ) {

                            return res
                                .status(400)
                                .send(

                                    `Subject "${subject}" is not available in ${exam.label}.`

                                );

                        }


                        /*
                        ------------------------------------------------
                        CHECK EXISTING MARK
                        ------------------------------------------------

                        IMPORTANT:

                        Existing mark is NEVER overwritten.

                        This is also protected server-side.
                        ------------------------------------------------
                        */

                        const existing =
                            await exam.Model
                                .findOne({

                                    admissionNumber:
                                        student
                                            .admissionNumber

                                })
                                .select(
                                    `admissionNumber ${subject}`
                                )
                                .lean();


                        if (
                            existing &&
                            existing[
                                subject
                            ] !==
                                undefined &&
                            existing[
                                subject
                            ] !==
                                null &&
                            String(
                                existing[
                                    subject
                                ]
                            ).trim() !== ""
                        ) {

                            continue;

                        }


                        /*
                        ------------------------------------------------
                        UPDATE EXISTING DOCUMENT
                        ------------------------------------------------
                        */

                        if (existing) {

                            await exam.Model
                                .updateOne(

                                    {
                                        admissionNumber:
                                            student
                                                .admissionNumber
                                    },

                                    {
                                        $set: {
                                            [subject]:
                                                value
                                        }
                                    }

                                );

                        }

                        /*
                        ------------------------------------------------
                        CREATE DOCUMENT
                        ------------------------------------------------
                        */

                        else {

                            await exam.Model.create({

                                admissionNumber:
                                    student
                                        .admissionNumber,

                                name:
                                    student.name,

                                rollNumber:
                                    student
                                        .rollNumber,

                                class:
                                    className,

                                section:
                                    student
                                        .section,

                                examType:
                                    exam.key,

                                [subject]:
                                    value

                            });

                        }


                        savedCount++;

                    }

                }


                console.log(
                    "NEW MARK FILL SAVED:",
                    savedCount
                );


                /*
                Back to setup page.
                */

                return res.redirect(
                    "/marksheet/new/mark-fill?success=1"
                );

            }
            catch (error) {

                console.error(
                    "NEW MARK SAVE ERROR:",
                    error
                );


                return res
                    .status(500)
                    .send(
                        "Unable to save marks."
                    );

            }

        });


    /*
    ===========================================================
    DONE
    ===========================================================
    */

    console.log(
        "New section-wise mark-fill routes registered."
    );


    return marksheet;

};