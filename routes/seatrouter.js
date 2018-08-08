var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Seats = require('../models/seats');

var seatRouter = express.Router();
seatRouter.use(bodyParser.json());

//list all elements in Seats
seatRouter.route('/')
.get(function (req, res, next) {
    Seats.find({}, function (err, seat) {
        if (err) throw err;
        res.json(seat);
    });
});

module.exports = seatRouter;
