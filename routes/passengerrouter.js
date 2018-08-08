var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Passengers = require('../models/passengers');

var passengerRouter = express.Router();
passengerRouter.use(bodyParser.json());

//add a passenger in Passengers
passengerRouter.route('/')
.post(function (req, res, next) {
    Passengers.create(req.body, function (err, passenger) {
        if (err) {
            console.log('Error: Passenger not added');
            res.json({
                sucess: false,
                error: JSON.stringify(err)
            });
        } else {
            console.log('Passenger added');
            var id = passenger._id;
            res.json({
                sucess: true,
                passenger: id
            });
        }

    });
});

module.exports = passengerRouter;
