const express = require('express');
const Joi = require('joi');

const db = require('../db');
const messages = db.get('messages');

const schema = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z0-9À-ÖØ-öø-ÿ -_]{3,30}$/).min(1).max(100).required(),
    message: Joi.string().min(1).max(500).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
})

const router = express.Router();

router.get('/', (req, res) => {
  messages
    .find()
    .then(allMessages => {
      res.json(allMessages);
    })
});

router.post('/1', (req, res) => {
  console.log(req.body);
});

router.get('/1', (req, res) => {
  console.log(req.body);
});

router.post('/', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (res.error === null) {
    const { name, message, latitude, longitude } = req.body;

    const userMessage = {
      name,
      message,
      latitude,
      longitude,
      date: new Date()
    }
    messages
      .insert(userMessage)
      .then(insertedMessage => {
        res.json(insertedMessage);
      });
    res.json([]);
  } else {
    next(result.error);
  }
});

module.exports = router;
