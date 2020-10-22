const express = require('express');
const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
const maxFileSize = 3 * 1024 * 1024;
const upload = multer({
    storage: fileStorage,
    limits: { fileSize: maxFileSize }
});

router.get('/',(req,res, next)=>{
    res.send('Get SuccessFul');
});

router.post('/signup', upload.single('image')  , userController.signup);
router.post('/station', isAuth, upload.single('image'), userController.createStation);
router.put('/login', userController.login);
router.get('/stations', isAuth, userController.getAllStations);
router.post('/createbooking', isAuth, userController.createBooking);
router.put('/status', isAuth, userController.updateUserStatus);

module.exports = router;