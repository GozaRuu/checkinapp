var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Seats = require('../models/seats');
var Passengers = require('../models/passengers');

var reserveRouter = express.Router();
reserveRouter.use(bodyParser.json());


//reserve a seat for a paid-checkin passenger
reserveRouter.route('/:passId/:seatId')
.get(function (req, res, next) {

    try {

        //check if the requestd seat is available
        Seats.findOne({number: req.params.seatId}, function (err, seat) {
            if (err) throw err;
            if(seat.available){
                //check if the passenger doesn't have a seat and he requested a paied checkin durring registration
                Passengers.findOne({passportNumber: req.params.passId}, function (err, passenger) {
                    if (err) throw err;
                    if(passenger.checkin && passenger.seat == ''){
                        console.log("ok");
                        //update the passenger
                        Passengers.findOneAndUpdate({passportNumber: req.params.passId}, {
                            $set: {seat : req.params.seatId}
                        }, {
                            new: true
                        }, function (err, passenger1) {
                            if (err) throw err;
                            //update the seat
                            Seats.findOneAndUpdate({number: req.params.seatId}, {
                                $set: {available : false}
                            }, {
                                new: true
                            }, function (err, seat1) {
                                if (err) throw err;
                                res.json({
                                    sucess: true,
                                    passenger: passenger1.passportNumber,
                                    seat: seat1.number
                                });
                            });
                        });


                        //set timer (3min) to undo the update if the passenger didn't pay

                        setTimeout(function(){
                            //check if passenger.paid is true or false
                            Passengers.findOne({passportNumber: req.params.passId}, function (err, passenger) {
                                if (err) throw err;
                                //undo passenger reservation
                                if (!passenger.paid) {
                                    Passengers.findOneAndUpdate({passportNumber: req.params.passId}, {
                                        $set: {seat : ''}
                                    }, {
                                        new: true
                                    }, function (err, passenger) {
                                        if (err) throw err;
                                        //make the seat availble
                                        Seats.findOneAndUpdate({number: req.params.seatId}, {
                                            $set: {available : true}
                                        }, {
                                            new: true
                                        }, function (err, seat) {
                                            if (err) throw err;
                                            res.json({
                                                sucess: false,
                                                error: "passenger didn't pay for reservation seat, therefore the seat is available.",
                                                passenger: req.params.passId,
                                                seat: req.params.seatId
                                            });
                                        });

                                    });

                                } else {
                                    res.json({
                                        sucess: true,
                                        description: "passenger successfully get his seat",
                                        passenger: req.params.passId,
                                        seat: req.params.seatId
                                    });
                                }

                            });
                        }, 180000);

                    } else {
                        console.log('Error: Reservation not completed');
                        res.json({
                            sucess: false,
                            error: "This passenger can't check in, contact support."
                        });
                    }
                });
            } else {
                console.log('Error: Reservation not completed');
                res.json({
                    sucess: false,
                    error: "Seat unavailable"
                });
            }
        });

    } catch (err) {
        console.log('Error: Reservation not completed');
        res.json({
            sucess: false,
            error: JSON.stringify(err)
        });
    }

});


//reserve a random seat for a free-checkin passenger
reserveRouter.route('/random/:passId')
.get(function (req, res, next) {
    //get all available seat numbers
    try {
        var availbleSeats = [];
        Seats.find({}, function (err, seat) {
            if (err) throw err;
            if(seat.availble){
                availbleSeats.push(seat.number);
            }
        });

        if(availbleSeats != []) {
            //assaign random seat to passenger
            var seatChosen = availbleSeats[ Math.floor( Math.random()*availbleSeats.length ) ];
            Passengers.findOneAndUpdate({passportNumber: req.params.passId}, {
                $set: { seat : seatChosen }
            }, {
                new: true
            }, function (err, passenger) {
                if (err) throw err;
                res.json({
                    sucess: true,
                    passenger: passenger.passportNumber,
                    seat: seatChosen
                });
            });
        } else {
            res.json({
                sucess: false,
                error: "No seats availble"
            });
        };

    } catch (err) {
        console.log('Error: Reservation not completed');
        res.json({
            sucess: false,
            error: JSON.stringify(err)
        });
    };

});



module.exports = reserveRouter;
