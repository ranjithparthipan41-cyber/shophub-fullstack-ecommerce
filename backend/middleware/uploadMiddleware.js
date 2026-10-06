const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,

    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only image files are allowed"
                )
            );
        }
    },

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;