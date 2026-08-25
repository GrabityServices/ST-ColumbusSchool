const studentlist =
    require("../models/studentlist.js");


async function fixStudentNames() {

    try {

        console.log(
            "\n================================"
        );

        console.log(
            "STARTING STUDENT NAME CLEANUP"
        );

        console.log(
            "================================\n"
        );


        const students =
            await studentlist
                .find({})
                .lean();


        console.log(
            "TOTAL STUDENTS:",
            students.length
        );


        let updatedCount = 0;


        for (
            const student
            of students
        ) {

            const oldName =
                student.studentName;


            if (!oldName) {

                continue;

            }


            /*
             * Remove postfix:
             *
             * (R)
             * (F)
             * {H}
             * {A}
             * etc.
             */

            const newName =
                String(oldName)

                    .replace(
                        /\s*[\(\{][^\)\}]*[\)\}]\s*$/,
                        ""
                    )

                    .trim();


            // Skip if already clean

            if (
                newName === oldName
            ) {

                continue;

            }


            console.log(
                "\nUPDATING STUDENT"
            );

            console.log(
                "OLD:",
                oldName
            );

            console.log(
                "NEW:",
                newName
            );


            // IMPORTANT:
            // Use updateOne instead of student.save()
            //
            // This prevents validation errors from
            // unrelated missing fields like className.

            await studentlist.updateOne(

                {
                    _id:
                        student._id
                },

                {
                    $set: {

                        studentName:
                            newName

                    }
                },

                {
                    runValidators:
                        false
                }

            );


            updatedCount++;

        }


        console.log(
            "\n================================"
        );

        console.log(
            "CLEANUP COMPLETE"
        );

        console.log(
            "TOTAL UPDATED:",
            updatedCount
        );

        console.log(
            "================================\n"
        );


        return {

            totalStudents:
                students.length,

            updated:
                updatedCount

        };

    }

    catch (error) {

        console.error(
            "CLEANUP ERROR:",
            error
        );

        throw error;

    }

}


fixStudentNames()


// ==========================================================
// CLEAN STUDENT HOUSE
//
// Examples:
//
// STD-7-A  → STD-7
// STD-7-B  → STD-7
// STD-10-A → STD-10
//
// Nursery-A → Nursery
// LKG-B     → LKG
// ==========================================================

const cleanStudentHouses =
    async () => {

        try {

            console.log(
                "\n================================="
            );

            console.log(
                "HOUSE CLEANUP STARTED"
            );

            console.log(
                "================================="
            );


            // ==============================================
            // GET ALL STUDENTS
            // ==============================================

            const students =
                await studentlist
                    .find({})
                    .lean();


            console.log(
                "TOTAL STUDENTS:",
                students.length
            );


            let updatedCount = 0;


            // ==============================================
            // LOOP THROUGH STUDENTS
            // ==============================================

            for (
                const student
                of students
            ) {

                // Skip if house does not exist

                if (
                    !student.house
                ) {

                    continue;

                }


                const oldHouse =
                    String(
                        student.house
                    ).trim();


                // ==========================================
                // REMOVE LAST SECTION
                //
                // STD-7-A → STD-7
                // STD-7-B → STD-7
                //
                // Only removes trailing "-A", "-B", etc.
                // ==========================================

                const newHouse =
                    oldHouse.replace(
                        /-[A-Za-z]$/,
                        ""
                    );


                // ==========================================
                // NO CHANGE NEEDED
                // ==========================================

                if (
                    oldHouse === newHouse
                ) {

                    continue;

                }


                console.log(
                    "\nUPDATING HOUSE"
                );

                console.log(
                    "Student:",
                    student.studentName
                );

                console.log(
                    "Admission:",
                    student.admissionNo
                );

                console.log(
                    "OLD:",
                    oldHouse
                );

                console.log(
                    "NEW:",
                    newHouse
                );


                // ==========================================
                // UPDATE ONLY HOUSE
                //
                // runValidators: false prevents problems
                // from missing fields such as className.
                // ==========================================

                await studentlist.updateOne(

                    {
                        _id:
                            student._id
                    },

                    {
                        $set: {

                            house:
                                newHouse

                        }
                    },

                    {
                        runValidators:
                            false
                    }

                );


                updatedCount++;

            }


            console.log(
                "\n================================="
            );

            console.log(
                "HOUSE CLEANUP COMPLETED"
            );

            console.log(
                "UPDATED STUDENTS:",
                updatedCount
            );

            console.log(
                "=================================\n"
            );


            return {

                success:
                    true,

                total:
                    students.length,

                updated:
                    updatedCount

            };


        } catch (error) {

            console.error(
                "HOUSE CLEANUP ERROR:",
                error
            );

            throw error;

        }

    };

cleanStudentHouses()