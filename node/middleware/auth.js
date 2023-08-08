const jwt = require('jsonwebtoken');
const express = require('express');
const tokenValidator = 'tokenMaster';
const jsonData = require('../../BurseJson.json');

const verifyToken = (req, res, next) => {
  const token = req.cookies.burseToken;
  if (!token) return res.status(401).send('Access denied.');
  try {
    const verified = jwt.verify(token, tokenValidator);
    req.user = verified;
    const trader = jsonData.traders.find(trader => trader.id === verified.id);
    if (trader) {
      req.user = trader;
      next();
    }
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = verifyToken;