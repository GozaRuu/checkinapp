var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creating the schema
var passengerSchema = new Schema({
    passportNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    checkin: {
        type: Boolean,
        required: true
    },
    seat: {
        type: String
    },
    paidSeat: {
        type: Boolean
    }
}, {
    timestamps: true
});

// creating the model
var Passengers = mongoose.model('Passenger', passengerSchema);

// exporting the model
module.exports = Passengers;
