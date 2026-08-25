// ==========================================================
// CLASS RESULT PRINT SYSTEM
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",

    () => {

        // ==================================================
        // MAIN CLASS SELECTION FORM
        // ==================================================

        const classResultPrintForm =
            document.getElementById(
                "classResultPrintForm"
            );


        if (classResultPrintForm) {

            const studentClass =
                document.getElementById(
                    "studentClass"
                );


            classResultPrintForm.addEventListener(

                "submit",

                event => {

                    event.preventDefault();


                    const selectedClass =
                        String(
                            studentClass.value || ""
                        ).trim();


                    if (!selectedClass) {

                        studentClass.focus();

                        return;

                    }


                    window.location.href =
                        `/stcolumbus/jaj/ekdara/admin/result/print/class/${encodeURIComponent(
                            selectedClass
                        )}`;

                }

            );

        }



        // ==================================================
        // STUDENT LIST ELEMENTS
        // ==================================================

        const studentSearch =
            document.getElementById(
                "studentSearch"
            );


        const selectAllStudents =
            document.getElementById(
                "selectAllStudents"
            );


        const clearAllStudents =
            document.getElementById(
                "clearAllStudents"
            );


        const selectedStudentCount =
            document.getElementById(
                "selectedStudentCount"
            );


        const printSelectedStudents =
            document.getElementById(
                "printSelectedStudents"
            );


        const selectedStudentPrintForm =
            document.getElementById(
                "selectedStudentPrintForm"
            );


        const studentCheckboxes =
            Array.from(

                document.querySelectorAll(
                    ".student-checkbox"
                )

            );


        const studentRows =
            Array.from(

                document.querySelectorAll(
                    ".student-row"
                )

            );


        // ==================================================
        // STOP IF STUDENT LIST PAGE IS NOT PRESENT
        // ==================================================

        if (

            studentCheckboxes.length === 0

        ) {

            return;

        }



        // ==================================================
        // UPDATE SELECTED COUNT
        // ==================================================

        const updateSelectedCount =
            () => {

                const selectedCount =
                    studentCheckboxes.filter(

                        checkbox =>
                            checkbox.checked

                    ).length;


                if (selectedStudentCount) {

                    selectedStudentCount.textContent =
                        selectedCount;

                }


                if (printSelectedStudents) {

                    printSelectedStudents.disabled =
                        selectedCount === 0;

                }


                // ==========================================
                // UPDATE SELECTED ROW STYLE
                // ==========================================

                studentCheckboxes.forEach(

                    checkbox => {

                        const row =
                            checkbox.closest(
                                ".student-row"
                            );


                        if (!row) {

                            return;

                        }


                        row.classList.toggle(

                            "is-selected",

                            checkbox.checked

                        );

                    }

                );

            };



        // ==================================================
        // INDIVIDUAL CHECKBOX CHANGE
        // ==================================================

        studentCheckboxes.forEach(

            checkbox => {

                checkbox.addEventListener(

                    "change",

                    () => {

                        updateSelectedCount();

                    }

                );

            }

        );



        // ==================================================
        // SELECT ALL
        //
        // Only selects visible students.
        // Hidden search results are not selected.
        // ==================================================

        if (selectAllStudents) {

            selectAllStudents.addEventListener(

                "click",

                () => {

                    studentCheckboxes.forEach(

                        checkbox => {

                            const row =
                                checkbox.closest(
                                    ".student-row"
                                );


                            if (

                                row

                                &&

                                !row.classList.contains(
                                    "is-hidden"
                                )

                            ) {

                                checkbox.checked =
                                    true;

                            }

                        }

                    );


                    updateSelectedCount();

                }

            );

        }



        // ==================================================
        // CLEAR ALL
        // ==================================================

        if (clearAllStudents) {

            clearAllStudents.addEventListener(

                "click",

                () => {

                    studentCheckboxes.forEach(

                        checkbox => {

                            checkbox.checked =
                                false;

                        }

                    );


                    updateSelectedCount();

                }

            );

        }



        // ==================================================
        // STUDENT SEARCH
        //
        // Search by:
        // - Name
        // - Admission Number
        // - Roll Number
        // ==================================================

        if (studentSearch) {

            studentSearch.addEventListener(

                "input",

                () => {

                    const searchValue =
                        studentSearch.value
                            .toLowerCase()
                            .trim();


                    studentRows.forEach(

                        row => {

                            const name =
                                row.dataset.name || "";


                            const admission =
                                row.dataset.admission || "";


                            const roll =
                                row.dataset.roll || "";


                            const isMatch =

                                name.includes(
                                    searchValue
                                )

                                ||

                                admission.includes(
                                    searchValue
                                )

                                ||

                                roll.includes(
                                    searchValue
                                );


                            row.classList.toggle(

                                "is-hidden",

                                !isMatch

                            );

                        }

                    );

                }

            );

        }



        // ==================================================
        // VALIDATE SELECTED PRINT FORM
        // ==================================================

        if (selectedStudentPrintForm) {

            selectedStudentPrintForm.addEventListener(

                "submit",

                event => {

                    const selectedCount =
                        studentCheckboxes.filter(

                            checkbox =>
                                checkbox.checked

                        ).length;


                    if (

                        selectedCount === 0

                    ) {

                        event.preventDefault();


                        alert(
                            "Please select at least one student."
                        );


                        return;

                    }


                    // Disable button to avoid double submission

                    if (printSelectedStudents) {

                        printSelectedStudents.disabled =
                            true;

                        printSelectedStudents.textContent =
                            "Preparing Results...";

                    }

                }

            );

        }



        // ==================================================
        // INITIAL STATE
        // ==================================================

        updateSelectedCount();

    }

);