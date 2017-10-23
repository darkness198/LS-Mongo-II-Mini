const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Person = require('./models.js');

const port = process.env.PORT || 3000;

const server = express();

// error status code constants
const STATUS_SERVER_ERROR = 500;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

// Your API will be built out here.

server.get('/users', (req, res) => {
  Person.find({}, (err, people) => {
    res.json(people);
  });
});

server.get('/users/:direction', (req, res) => {
  Person.find({})
    .sort({ firstName: req.params.direction })
    .exec((err, people) => {
      res.json(people);
    });
});

server.get('/user-get-friends/:id', (req, res) => {
  Person.where('_id', req.params.id)
    .select('friends')
    .exec((err, friends) => {
      res.json(friends);
    });
});

server.put('/changename', (req, res) => {
  Person.where('firstName', req.query.oldFirst)
    .and([{ lastName: req.query.oldLast }])
    .update({ firstName: req.query.newFirst, lastName: req.query.newLast })
    .exec();
  Person.where('firstName', req.query.oldFirst)
    .and([{ lastName: req.query.oldLast }])
    .exec((err, person) => {
      res.json(person);
    });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect('mongodb://localhost/people', {
  useMongoClient: true
});
/* eslint no-console: 0 */
connect.then(
  () => {
    server.listen(port);
    console.log(`Server Listening on ${port}`);
  },
  err => {
    console.log('\n************************');
    console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
    console.log('************************\n');
  }
);
