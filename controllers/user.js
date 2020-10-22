const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const Station = require('../models/station');
const Booking = require('../models/booking');
const mongoose = require('mongoose');
const UserStatus = require('../models/userStatus');
const UserRole = require('../models/enums/UserRole.enum');

exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const role = req.body.role;
    const image = req.file;
    if (!image) {
        const error = new Error('Image Should Upload');
        error.statusCode = 422;
        throw error;
    }
    try {
        const hashedPw = await bcrypt.hash(password, 12);
        const imageUrl = image.path;

        const user = new User({
            email: email,
            password: hashedPw,
            name: name,
            imageUrl: imageUrl
        });
        const result = await user.save();
        if (result.role === UserRole.CONSUMER) {
            const userStatus = new UserStatus({
                user: mongoose.Types.ObjectId(result._id)
            })
            await userStatus.save();
        }
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createStation = async (req, res, next) => {
    const role = req.token.role;
    if (role !== UserRole.STATION_INCHAGE) {
        const error = new Error('You Are Not Station Incharge');
        error.statusCode = 401;
        throw error;
    }
    const station = new Station({
        name: req.body.name,
        stationType: req.body.bookingType,
        distance: req.body.distance,
        imageUrl: req.file.path,
    });
    try {
        const response = await station.save();
        if (!response) {
            const error = new Error('Name Should Be Unique');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({ id: response._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                id: loadedUser._id.toString(),
                role: loadedUser.role
            },
            process.env.SECRET_KEY,
            { expiresIn: '10d' }
        );
        res.status(200).json({ token: token, userId: loadedUser._id.toString(), role: loadedUser.role });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getAllStations = async (req, res, next) => {
    try {
        const stations = await Station.find().sort({ distance: 1 });
        if (!stations) {
            const error = new Error('No Station Found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ stations: stations });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createBooking = async (req, res, next) => {
    const booking = new Booking({
        bookingType: req.body.bookingType,
        vehiclesType: req.body.vehicleType,
        station: mongoose.Types.ObjectId(req.params.id),
        bookingBy: mongoose.Types.ObjectId(req.token.id)
    });
    try {
        const response = await booking.save();
        await User.update({_id:mongoose.Types.ObjectId(req.token.id)},{$push:{bookings:mongoose.Types.ObjectId(booking._id)}});
        await Station.update({_id:mongoose.Types.ObjectId(req.params.id)},{$push:{bookings:mongoose.Types.ObjectId(booking._id)}})
        if (!booking) {
            const error = new Error('Booking Failed');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ id: response._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    const role = req.token.role;
    if (role !== UserRole.STATION_INCHAGE) {
        const error = new Error('You Are Not Station Incharge');
        error.statusCode = 401;
        throw error;
    }
    try {
        const updatedStatus = (await UserStatus.findOneAndUpdate({ user: req.params.id }, { $set: req.body })).populate('user');
        res.status(200).json({ updatedStatus: updatedStatus });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


}
