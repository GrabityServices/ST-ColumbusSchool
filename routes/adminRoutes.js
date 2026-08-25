

const express = require("express");
// ==========================================================
// SUPER ADMIN RESULT PRINT CONTROLLERS
// ==========================================================

const showClassResultPrintPage =
    require("../controllers/ResultPrint/showClassResultPrintPage.js")

const getClassStudentsForPrint =
    require("../controllers/ResultPrint/getClassStudentsForPrint.js");

const printSelectedClassResults =
    require("../controllers/ResultPrint/printSelectedClassResults.js");

const printAllClassResults =
    require("../controllers/ResultPrint/printAllClassResults.js");


const adminroute = express.Router();
const adminManagment = express.Router();
const { adminAccountAvt, saveAdminAccountAvt } = require("../utils/updateAdminAccountImg.js");
const { checkAdminAsSuperadmin } = require("../middleware/checkAdmin.js");
const jwt = require("jsonwebtoken")
const { checkAdmin, checkAdminAsEditor } = require("../middleware/checkAdmin.js");



const multer = require("multer");
const XLSX = require("xlsx");

const Student = require("../models/studentlist.js");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// ======================accpunt Handlers==============
const {
  handleStAdmin,
  hadnleLoginForm,
  handleForgotForm,
  hadnleSignupForm,
  setNewPass,
} = require("../handler/stcolumbusadmin.js");
//==============UserAdmin Updates Handler=============================
const {
  handleUpdateAdminImg,
  handleUpdateAdminDet,
  handleDeleteAdmin,
  hadnleUpdateBySuperAdmin,
} = require("../handler/stcolumbusadmin.js");
const swndOtp = require("../handler/auth.controller.js");
const { storeOtp, getOtp,storeEditOtp, getEditOtp } = require("../utils/redis.js");
const UserAdmin = require("../models/userAdmin.js");
const modifiedemail = require("../utils/modifyemail.js");
const sendOtp = require("../handler/auth.controller.js");
//==================admin work=================================
adminroute.route("").get(handleStAdmin);
adminroute
  .route("/update/img/:id")
  .get((req, res) =>
    res.render("takeFile.ejs", {
      id: req.params.id,
      adminUpdate: false,
      userAdminUpdate: true,
      galleryUpdate: false,
      noticeUpdate: false,
    })
  )
  .post(adminAccountAvt.single("img"), saveAdminAccountAvt, handleUpdateAdminImg);

adminroute
  .route("/update/det/:id")
  .get(async (req, res) => {
    const data = await jwt.verify(req.cookies.stadminis, process.env.JWTKEYIS)
    let fname = ""
    let lname = ""
    try {
      const name = data.name
      const newName = name.split(" ")
      fname = newName[0]
      lname = newName[1]
    } catch (err) {
      console.log(err)
    }
    res.render("updateAdminAccountDet.ejs", { id: req.params.id, pre: [fname, lname, data.email] })
  })
  .post(handleUpdateAdminDet);

adminroute
  .route("/update/det/superadmin/:id")
  .get(checkAdminAsSuperadmin, (req, res) =>
    res.render("updateBySuperAdmin.ejs", { id: req.params.id })
  )
  .post(checkAdminAsSuperadmin, hadnleUpdateBySuperAdmin);

adminroute.route("/delete/:id").get(checkAdminAsSuperadmin, handleDeleteAdmin);


//=======================admin login logout section=========================================
adminManagment
  .route("/login")
  .get((req, res) => {
    if (req.cookies.stadminis) {
      return res.redirect("/stcolumbus/jaj/ekdara/admin");
    }
    res.render("loginForm.ejs");
  })
  .post(hadnleLoginForm);

adminManagment
  .route("/signup")
  .get(checkAdminAsSuperadmin, (req, res) => res.render("signupForm.ejs"))
  .post(checkAdminAsSuperadmin, hadnleSignupForm);

adminManagment
  .route("/forgot/pass")
  .get((req, res) => res.render("forgotAdminPass.ejs", { user: false }))
  .post(handleForgotForm);
  
adminManagment.route("/forgot/pass/setpass").post(setNewPass)


adminManagment.route("/change/pass").get((req, res) => {
  res.render("forgotAdminPass.ejs", { user: true });
});


adminManagment.route("/logout").get((req, res) => {
  res.cookie("stadminis", null, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now()),
  });
  res.redirect('/stcolumbus/admin/manage/login')
})

adminManagment
  .route("/verify/email/:id")
  .get(async (req, res) => {
    console.log(req.params.id);
    let otp = await getOtp(req.params.id);
    if (!otp) {
      const unqid = await UserAdmin.findOne({ email: req.params.id }).select('uniqId');
      otp = await sendOtp(req.params.id, unqid.uniqId,edit=false);
      if (otp) {
        storeOtp(req.params.id, otp)
        const email = req.params.id;
        const modified = await modifiedemail(email)
        console.log("otp sent again", modified);
        
        res.render("Otp.ejs", { memail: modified, email:email, reenter: false, edit: false  })
    }
    else {
        res.redirect("http://localhost:3000/stcolumbus/admin/manage/forgot/pass")
    }
} else {
    const email = req.params.id;
    const modified = await modifiedemail(email)
    console.log("otp sent again", modified);
      res.render("Otp.ejs", { memail: modified, email:email, reenter: false, edit: false  })
    }
  })
  .post(async (req, res) => {
    const id = req.params.id
    const otp = await getOtp(id)
    if (otp == req.body.fotp) {
      console.log("otp matched");
      res.render("forgotAdminPass.ejs", {
        user: true,
        idOrEmail: id
      });
    } else {
      const email = req.params.id;
      const modified = await modifiedemail(email)
      console.log("otp not matched", modified);
      res.render("Otp.ejs", { memail: modified, email, reenter: true, edit: false })
    }
  })


adminManagment
    .route("/verify/email/edit/:id")
    .get(checkAdmin,checkAdminAsEditor,async (req, res) => {

        try {

            // ==========================================
            // 1. GET LOGIN COOKIE
            // ==========================================

            const token = req.cookies.stadminis;

            if (!token) {
                return res.redirect(
                    "/stcolumbus/admin/manage/login"
                );
            }

            // ==========================================
            // 2. VERIFY LOGIN JWT
            // ==========================================

            let decoded;

            try {

                decoded = jwt.verify(
                    token,
                    process.env.JWTKEYIS
                );

            } catch (error) {

                console.log(
                    "Login JWT invalid/expired"
                );

                return res.redirect(
                    "/stcolumbus/admin/manage/login"
                );
            }

          

            // ==========================================
            // 3. GET EMAIL FROM URL
            // ==========================================

            const email = req.params.id;

            console.log(
                "Verification email:",
                email
            );

            // ==========================================
            // 4. CHECK URL EMAIL WITH LOGIN EMAIL
            // ==========================================

            if (
                email.toLowerCase() !==
                decoded.email.toLowerCase()
            ) {

                console.log(
                    "Email does not belong to logged-in user"
                );

                return res.redirect(
                    "/stcolumbus/admin/manage/login"
                );
            }

            // ==========================================
            // 5. FIND ADMIN
            // ==========================================

            const admin = await UserAdmin
                .findById(decoded.id)
                .select("email uniqId");

            if (!admin) {

                console.log(
                    "Admin not found:",
                    decoded.id
                );

                return res.status(404).send(
                    "Admin not found"
                );
            }

            // ==========================================
            // 6. CHECK EXISTING EDIT COOKIE
            // ==========================================

            const editToken =
                req.cookies.editVerified;

            if (editToken) {

                try {

                    const editDecoded = jwt.verify(
                        editToken,
                        process.env.JWTKEYIS
                    );

                    if (
                        editDecoded.purpose ===
                            "edit-access" &&

                        String(editDecoded.userId) ===
                            String(decoded.id) &&

                        editDecoded.email.toLowerCase() ===
                            decoded.email.toLowerCase()
                    ) {

                        console.log(
                            "Already edit verified"
                        );

                        return res.redirect(
                            "/stcolumbus/admin/manage/marksheet/edit"
                        );
                    }

                } catch (error) {

                    console.log(
                        "Old edit verification cookie expired"
                    );

                    // Remove expired/invalid cookie
                    res.clearCookie("editVerified");
                }
            }

            // ==========================================
            // 7. CHECK EXISTING OTP
            // ==========================================

            let otp = await getEditOtp(admin.email);
            console.log(
                "Existing OTP:",
                otp
            );

            // ==========================================
            // 8. SEND OTP
            // ==========================================

            if (!otp) {
                console.log(
                    "No existing OTP found, sending new OTP"
                );
                otp = await sendOtp(
                    admin.email,
                    admin.uniqId,
                    edit=true
                );

                if (!otp) {

                    return res.status(500).send(
                        "Unable to send verification email"
                    );
                }

                storeEditOtp(
                    admin.email,
                    otp
                );

                console.log(
                    "OTP sent to:",
                    admin.email
                );
              
            }

            // ==========================================
            // 9. SHOW OTP PAGE
            // ==========================================

            const modified =
                await modifiedemail("st.columbus2002@gmail.com");

            return res.render(
                "Otp.ejs",
                {
                    memail: modified,
                    email: admin.email,
                    reenter: false,
                    edit: true
                }
            );

        } catch (error) {

            console.error(
                "Email verification error:",
                error
            );

            return res.status(500).json({
                success: false,
                status: 500,
                message: error.message
            });
        }
    })
.post(async (req, res) => {

    try {

        // ==========================================
        // 1. GET LOGIN TOKEN
        // ==========================================

        const loginToken = req.cookies.stadminis;

        if (!loginToken) {
            return res.redirect(
                "/stcolumbus/admin/manage/login"
            );
        }


        // ==========================================
        // 2. VERIFY LOGIN JWT
        // ==========================================

        let decoded;

        try {

            decoded = jwt.verify(
                loginToken,
                process.env.JWTKEYIS
            );

        } catch (error) {

            console.log(
                "Login JWT invalid/expired"
            );

            return res.redirect(
                "/stcolumbus/admin/manage/login"
            );
        }


        // ==========================================
        // 3. GET EMAIL FROM URL
        // ==========================================

        const email = req.params.id;

        if (!email) {
            return res.status(400).send(
                "Email is required"
            );
        }


        // ==========================================
        // 4. MAKE SURE EMAIL BELONGS TO LOGIN USER
        // ==========================================

        if (
            email.toLowerCase() !==
            decoded.email.toLowerCase()
        ) {

            console.log(
                "❌ Email does not belong to logged-in user"
            );

            return res.redirect(
                "/stcolumbus/admin/manage/login"
            );
        }


        // ==========================================
        // 5. GET OTP
        // ==========================================

        const storedOtp = await getEditOtp(
            decoded.email
        );

        console.log(
            "OTP from Redis:",
            storedOtp
        );

        console.log(
            "OTP from body:",
            req.body.eotp
        );


        // ==========================================
        // 6. CHECK OTP EXISTS
        // ==========================================

        if (!storedOtp) {

            console.log(
                "❌ OTP expired or not found"
            );

            const modified =
                await modifiedemail(decoded.email);

            return res.render(
                "Otp.ejs",
                {
                    memail: modified,
                    email: decoded.email,
                    reenter: true,
                    edit: true,
                    error: "OTP expired. Please request a new OTP."
                }
            );
        }


        // ==========================================
        // 7. NORMALIZE OTP
        // ==========================================

        const enteredOtp =
            String(req.body.eotp || "").trim();

        const redisOtp =
            String(storedOtp).trim();


        // ==========================================
        // 8. VERIFY OTP
        // ==========================================

        if (enteredOtp !== redisOtp) {

            console.log(
                "❌ OTP not matched"
            );

            const modified =
                await modifiedemail(decoded.email);

            return res.render(
                "Otp.ejs",
                {
                    memail: modified,
                    email: decoded.email,
                    reenter: true,
                    edit: true,
                    error: "Invalid OTP. Please try again."
                }
            );
        }


        // ==========================================
        // 9. OTP VERIFIED
        // ==========================================

        console.log(
            "✅ OTP matched for:",
            decoded.email
        );


        // ==========================================
        // 10. CREATE EDIT ACCESS JWT
        // ==========================================

        const editToken = jwt.sign(
            {
                purpose: "edit-access",
                userId: decoded.id,
                email: decoded.email
            },
            process.env.JWTKEYIS,
            {
                expiresIn: "10m"
            }
        );


        // ==========================================
        // 11. SET EDIT VERIFICATION COOKIE
        // ==========================================

        res.cookie(
            "editVerified",
            editToken,
            {
                httpOnly: true,

                // localhost = false
                // production HTTPS = true
                secure:
                    process.env.NODE_ENV ===
                    "production",

                sameSite: "strict",

                maxAge:
                    30000,

                path: "/"
            }
        );


        // ==========================================
        // 12. DELETE OTP
        // ==========================================

        // Recommended:
        // await deleteEditOtp(decoded.email);


        // ==========================================
        // 13. REDIRECT TO EDIT PAGE
        // ==========================================

        return res.redirect(
            `/marksheet/edit/${encodeURIComponent(decoded.email)}`
        );


    } catch (error) {

        console.error(
            "Edit OTP verification error:",
            error
        );

        return res.status(500).send(
            "Something went wrong while verifying OTP."
        );
    }


})

adminroute
.get("/import-students", checkAdminAsSuperadmin,async (req, res) => {

    try {

      res.render("import-students");

    } catch (error) {

      console.error(error);

      res.status(500).send(
        "Unable to open import page"
      );

    }

  })
 .post(
  "/import-students",checkAdminAsSuperadmin,
  upload.single("file"),

  async (req, res) => {

    console.log("================================");
    console.log("IMPORT STUDENTS ROUTE HIT");
    console.log("================================");

    try {

      // =========================================
      // CHECK FILE
      // =========================================

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Please select an Excel file"
        });

      }


      console.log(
        "Uploaded file:",
        req.file.originalname
      );

      console.log(
        "File size:",
        req.file.size
      );


      // =========================================
      // READ EXCEL
      // =========================================

      const workbook = XLSX.read(
        req.file.buffer,
        {
          type: "buffer"
        }
      );


      if (
        !workbook.SheetNames ||
        workbook.SheetNames.length === 0
      ) {

        return res.status(400).json({
          success: false,
          message: "No worksheet found in Excel file"
        });

      }


      const sheetName =
        workbook.SheetNames[0];


      console.log(
        "Sheet:",
        sheetName
      );


      const worksheet =
        workbook.Sheets[sheetName];


      const rows =
        XLSX.utils.sheet_to_json(
          worksheet,
          {
            defval: "",
            raw: true
          }
        );


      console.log(
        "Rows found:",
        rows.length
      );


      if (!rows.length) {

        return res.status(400).json({
          success: false,
          message: "Excel file is empty"
        });

      }


      console.log(
        "First row:",
        rows[0]
      );


      // =========================================
      // CONVERT EXCEL → STUDENTS
      // =========================================

      const students = [];


      for (const row of rows) {

        const admissionNo =
          String(
            row["Admission No."] ?? ""
          ).trim();


        const studentName =
          String(
            row["Student Name"] ?? ""
          ).trim();


        // Skip completely invalid rows
        if (
          !admissionNo ||
          !studentName
        ) {
          continue;
        }


        const student = {

          admissionNo,

          house:
            String(
              row["House"] ?? ""
            ).trim(),

          section:
            String(
              row["Section"] ?? ""
            ).trim()
            .toUpperCase(),

          rollNo:
            Number(
              row["RollNo"] ?? 0
            ),

          studentName,

          fatherName:
            String(
              row["Father Name"] ?? ""
            ).trim()

        };


        students.push(student);

      }


      console.log(
        "Valid students before duplicate removal:",
        students.length
      );


      // =========================================
      // REMOVE DUPLICATE ADMISSION NUMBERS
      // =========================================

      const uniqueStudents =
        new Map();


      for (const student of students) {

        uniqueStudents.set(
          student.admissionNo,
          student
        );

      }


      const validStudents =
        Array.from(
          uniqueStudents.values()
        );


      console.log(
        "Unique students:",
        validStudents.length
      );


      const duplicateCount =
        students.length -
        validStudents.length;


      console.log(
        "Duplicate rows removed:",
        duplicateCount
      );


      if (!validStudents.length) {

        return res.status(400).json({

          success: false,

          message:
            "No valid students found in Excel",

          totalRows:
            rows.length

        });

      }


      // =========================================
      // CHECK CURRENT DATABASE
      // =========================================

      const beforeCount =
        await Student.countDocuments();


      console.log(
        "Students currently in MongoDB:",
        beforeCount
      );


      // =========================================
      // CREATE BULK OPERATIONS
      // =========================================

      const operations =
        validStudents.map(student => ({

          updateOne: {

            filter: {

              admissionNo:
                student.admissionNo

            },


            update: {

              $set: {

                house:
                  student.house,

                section:
                  student.section,

                rollNo:
                  student.rollNo,

                studentName:
                  student.studentName,

                fatherName:
                  student.fatherName

              },

              $setOnInsert: {

                admissionNo:
                  student.admissionNo

              }

            },


            upsert: true

          }

        }));


      console.log(
        "MongoDB operations:",
        operations.length
      );


      // =========================================
      // INSERT / UPDATE
      // =========================================

      const result =
        await Student.bulkWrite(
          operations,
          {
            ordered: false
          }
        );


      // =========================================
      // RESULT
      // =========================================

      console.log(
        "================================"
      );

      console.log(
        "MONGODB IMPORT RESULT"
      );

      console.log(
        "================================"
      );

      console.log(
        "Matched:",
        result.matchedCount
      );

      console.log(
        "Modified:",
        result.modifiedCount
      );

      console.log(
        "Inserted:",
        result.upsertedCount
      );


      const afterCount =
        await Student.countDocuments();


      console.log(
        "Students after import:",
        afterCount
      );


      // =========================================
      // RESPONSE
      // =========================================
      require("../utils/codeCleanup.js")
      return res.redirect('/stcolumbus/jaj/ekdara/admin')

    } catch (error) {

      console.error(
        "================================"
      );

      console.error(
        "IMPORT ERROR"
      );

      console.error(
        "================================"
      );

      console.error(
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Excel import failed",

        error:
          error.message

      });

    }

  }
);

// ==========================================================
// SUPER ADMIN CLASS RESULT PRINT SYSTEM
// ==========================================================
// Exact routes first

adminroute.get(
    "/result/print",checkAdminAsSuperadmin,
    showClassResultPrintPage
);


adminroute.post(
    "/result/print/selected",
    printSelectedClassResults
);


// Specific parameter routes
adminroute.get(
    "/result/print/class/:className",
    getClassStudentsForPrint
);

adminroute.get(
    "/result/print/all/:className",
    printAllClassResults
);



module.exports = router;
module.exports = { adminroute, adminManagment };