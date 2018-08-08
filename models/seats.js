var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creating the schema
var seatSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

// creating the model
var Seats = mongoose.model('Seat', seatSchema);

// exporting the model
module.exports = Seats;
