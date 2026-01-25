const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // folder jaha file save hogi
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // filename set
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
        cb(null, true); // accept file
    } else {
        cb(new Error('Only images allowed!'), false); // reject file
    }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;