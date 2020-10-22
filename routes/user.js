const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');
const multer = require('multer');
const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date.toISOString() + '-' + file.originalname)
    }
});
const maxFileSize = 3 * 1024 * 1024;
const upload = multer({
    storage: fileStorage,
    limits: { fileSize: maxFileSize }
});


router.post('/signup', upload.single('image')  , userController.signup);
router.post('/station', isAuth, upload.single('image'), userController.createStation);
router.post('/login', userController.login);
router.get('/stations', isAuth, userController.getAllStations);
router.post('/createbooking', isAuth, userController.createBooking);
router.put('/status', isAuth, userController.updateUserStatus);

module.exports = router;