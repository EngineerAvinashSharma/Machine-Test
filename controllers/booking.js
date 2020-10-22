const Station = require('../models/station');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const { UserRole } = require('../models/enums/UserRole.enum');
const UserStatus = require('../models/userStatus');
const mongoose = require('mongoose');
const UserStat = require('../models/enums/UserStatus.enum');


exports.getAllBookings = async (req, res, next) => {
    const role = req.token.role;
    if (role !== UserRole.STATION_INCHAGE) {
        const error = new Error('You Are Not Station Incharge');
        error.statusCode = 401;
        throw error;
    }
    try {
        const booking = await Booking.find({ station: mongoose.Types.ObjectId(req.params.id) }).sort({ createdAt: -1 });
        res.status(200).json({ bookings: booking });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getBooking = async (req, res, next) => {
    const role = req.token.role;
    if (role !== UserRole.STATION_INCHAGE) {
        const error = new Error('You Are Not Station Incharge');
        error.statusCode = 401;
        throw error;
    }
    try {
        const booking = await Booking.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).populated('bookingBy').populate('fillingBy');
        const getconsumerStatus = await UserStatus.findOne({ station: mongoose.Types.ObjectId(booking.station), user: mongoose.Types.ObjectId(booking.bookingBy._id) });
        if (getconsumerStatus.status === UserStat.Blocked || getconsumerStatus.status === UserStat.Deleted) {
            delete booking.bookingBy;
            return res.status(200).send({ bookings: booking })
        }
        res.status(200).json({ bookings: booking });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateBooking = async (req, res, next) => {
    const role = req.token.role;
    if (role !== UserRole.EMPLOYEE) {
        const error = new Error('You Are Not Station Incharge');
        error.statusCode = 401;
        throw error;
    }
    req.body.fillingBy = req.token.id;
    try {
        const updatedBooking = await (await Booking.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })).populate('bookingBy').populate('fillingBy');
        res.status(200).json({ booking: updatedBooking });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

