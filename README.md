# checkinapp
Nodejs, MongoDB, Express, and Mongoose backend application to handle check-in of passenger at an airport.


# install
Your system should have NodeJs, NPM, and MongoDB installed.
After cloning the repo open a commandline instance and run:
`npm install`

In another command-line instance open your MongoDB system on port 27018 (default) in a new folder of your choice:
`mongod --dbpath=projects/mongodbserver`
Make sure to keep this server running

Back to the first commandline-instance run:
`npm start` to start the NodeJs server
By default, the server will be running at: `localhost:3000`

To consume the server in a fast way you can use for expample `Postman` an extension for Google Chrome.

---

# Accessing the API
The API have these following endpoints:
Get request at `/seats` will return a JSON object containing all the seats at the airplane in question.
***
Post request at `/passengers` will allow registering passengers. It will parse the body of your request and send to the database.
***
Get request at `/reserve/:passengerPassportNumber/:seatNumber` will try to bind a passenger to a seat depending on internal rules
***
Get request at `/reserve/random/:passengerPassportNumber` will return bind a passenger to a random available seat.
