const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const verifyEdit = (req, res, next) => {

    // ==========================================
    // LOG FILE SETUP
    // ==========================================

    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "edit-access.log");

    // Create logs folder if it doesn't exist
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, {
            recursive: true
        });
    }


    // ==========================================
    // LOG FUNCTION
    // ==========================================

    const logEditAttempt = ({
        status,
        name = "Unknown",
        adminId = "Unknown",
        email = "Unknown",
        reason = "Unknown"
    }) => {

        const log = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 EDIT ACCESS LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status     : ${status}
Name       : ${name}
Admin ID   : ${adminId}
Email      : ${email}
Reason     : ${reason}
IP         : ${req.ip}
Method     : ${req.method}
URL        : ${req.originalUrl}
User-Agent : ${req.get("user-agent")}
Time       : ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

        // Console

        // File
        fs.appendFileSync(
            logFile,
            log + "\n",
            "utf8"
        );
    };


    try {

        // ==========================================
        // 1. CHECK LOGIN JWT
        // ==========================================

        const loginToken = req.cookies.stadminis;

        if (!loginToken) {

            logEditAttempt({
                status: "TRIED",
                reason: "Login token missing"
            });

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

            logEditAttempt({
                status: "TRIED",
                reason: "Login token invalid or expired"
            });

            return res.redirect(
                "/stcolumbus/admin/manage/login"
            );
        }


        // ==========================================
        // ADMIN INFORMATION
        // ==========================================

        const {
            id: adminId,
            email,
            name
        } = decoded;


        // ==========================================
        // 3. CHECK EDIT VERIFICATION JWT
        // ==========================================

        const editToken = req.cookies.editVerified;

        if (!editToken) {

            logEditAttempt({
                status: "TRIED",
                name,
                adminId,
                email,
                reason: "Edit verification token missing"
            });

            const encodedEmail =
                encodeURIComponent(email);

            return res.redirect(
                `/stcolumbus/admin/manage/verify/email/edit/${encodedEmail}`
            );
        }


        // ==========================================
        // 4. VERIFY EDIT JWT
        // ==========================================

        let editDecoded;

        try {

            editDecoded = jwt.verify(
                editToken,
                process.env.JWTKEYIS
            );

        } catch (error) {

            logEditAttempt({
                status: "TRIED",
                name,
                adminId,
                email,
                reason: "Edit verification token expired or invalid"
            });

            res.clearCookie(
                "editVerified",
                {
                    httpOnly: true,
                    secure:
                        process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/"
                }
            );

            const encodedEmail =
                encodeURIComponent(email);

            return res.redirect(
                `/stcolumbus/admin/manage/verify/email/edit/${encodedEmail}`
            );
        }


        // ==========================================
        // 5. CHECK TOKEN PURPOSE
        // ==========================================

        if (
            editDecoded.purpose !== "edit-access"
        ) {

            logEditAttempt({
                status: "DENIED",
                name,
                adminId,
                email,
                reason: "Invalid edit authorization purpose"
            });

            return res.status(403).send(
                "Invalid edit authorization."
            );
        }


        // ==========================================
        // 6. CHECK USER ID
        // ==========================================

        if (
            String(editDecoded.userId) !==
            String(adminId)
        ) {

            logEditAttempt({
                status: "DENIED",
                name,
                adminId,
                email,
                reason: "User ID mismatch"
            });

            return res.status(403).send(
                "Unauthorized edit access."
            );
        }


        // ==========================================
        // 7. CHECK EMAIL
        // ==========================================

        if (
            !editDecoded.email ||
            !email ||
            editDecoded.email.toLowerCase() !==
            email.toLowerCase()
        ) {

            logEditAttempt({
                status: "DENIED",
                name,
                adminId,
                email,
                reason: "Email mismatch"
            });

            return res.status(403).send(
                "Unauthorized edit access."
            );
        }


        // ==========================================
        // 8. ACCESS ALLOWED
        // ==========================================

        logEditAttempt({
            status: "ALLOWED",
            name,
            adminId,
            email,
            reason: "All edit authorization checks passed"
        });

        console.log(
            "✅ Edit access verified:",
            email
        );


        // ==========================================
        // 9. MAKE USER INFORMATION AVAILABLE
        // ==========================================

        req.user = decoded;
        req.editVerified = editDecoded;


        // ==========================================
        // 10. CONTINUE REQUEST
        // ==========================================

        next();


    } catch (error) {

        // ==========================================
        // UNEXPECTED ERROR
        // ==========================================

        console.error(
            "❌ verifyEdit error:",
            error
        );

        logEditAttempt({
            status: "TRIED",
            reason: "Unexpected middleware error"
        });

        return res.redirect(
            "/stcolumbus/admin/manage/login"
        );
    }
};


module.exports = verifyEdit;
