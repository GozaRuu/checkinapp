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
                        }, function (err, passenger) {
                            if (err) throw err;
                            res.json({
                                sucess: true,
                                passenger: passenger.passportNumber
                            });
                        });

                        //update the seat
                        Seats.findOneAndUpdate({number: req.params.seatId}, {
                            $set: {available : false}
                        }, {
                            new: true
                        }, function (err, seat) {
                            if (err) throw err;
                            res.json({
                                sucess: true,
                                seat: seat.number
                            });
                        });

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

// try {
//     //get all seat numbers available
//     reserveRouter.route('/:passId/')
//     .get(function (req, res, next) {
//         Seats.find({}, function (err, seats) {
//             if (err) throw err;
//         });
//     });
// } catch (err) {
//     console.log('Error: Reservation not completed');
//     res.json({
//         sucess: false,
//         error: JSON.stringify(err)
//     });
// }


module.exports = reserveRouter;
