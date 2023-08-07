const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateToken = require('./middleware/auth');
const port = 3000;
const tokenValidator = 'tokenMaster';
const jsonData = require('./BurseJson.json');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');

let tradeIdCounter = 1; // Initialize the counter with a starting value

function initializeTradeIds(){
  jsonData.requests.forEach(item => {
    item.id = tradeIdCounter; // Assign a unique ID
    tradeIdCounter++; // Increment the counter for the next use
  });
}

initializeTradeIds();

const corsOptions = {
  origin: 'http://localhost:4200', // Specify the exact origin of your Angular app
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


let shares = jsonData.shares;
let traders = jsonData.traders;
let orders = jsonData.requests;

function generateRandomInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeShares() { //adds or subtracts up to 10% of each share randomly
  for(let i=0; i<shares.length;i++){
    shares[i].currentPrice += Math.round(generateRandomInRange(-1 * (shares[i].currentPrice/10+1), shares[i].currentPrice/10+1))+1;
  }
}
const interval = 10000; // 10 seconds in milliseconds
const intervalId = setInterval(changeShares, interval);

app.get('/', async (req, res) => {
  res.send('hello');
});

app.get('/login', (req, res) => {
  //TODO login:: res.send('<div class="row">\n<div class="col-12 mt-3">\n<h1 class="display-3">How was that gut exam?</h1>\n<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, perferendis!</p>\n</div>\n</div>\n<div class="row">\n<div class="col-lg-6">\n<form id="contact-form" action="" method="POST" novalidate="novalidate" autocomplete="off">\n<div class="form-group">\n<label for="email">* Email:</label>\n<input type="text" name="email" id="email" class="form-control">\n</div>\n<div class="form-group">\n<label for="password">* Password:</label>\n<input type="password" name="password" id="password" class="form-control">\n</div>\n<button type="submit" name="submit" value="Contact Me" class="btn btn-primary">Log in</button>\n</form>\n</div>\n</div>');
  res.send('login page');
});

app.post('/login', async (req, res) => {
  const trader = traders.find(trader => trader.id === req.body.id);
  if (!trader) return res.status(400).send('Trader not found.');
  try {
    const token = jwt.sign({ id: trader.id }, tokenValidator);
    res.cookie('burseToken', token, {sameSite: 'none', secure: true});
    res.send({data:'logged in!'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/home', validateToken, async (req, res) => {
    const loggedTrader = req.user;
    res.send(loggedTrader);
});


app.get('/shares', (req, res) =>{
    res.send(shares);
});

app.get('/traders', (req, res) =>{
    res.send(traders);
});

app.get('/orders', (req, res) =>{
    res.send(orders);
});

app.get('/logout', validateToken, (req, res) =>{
  res.clearCookie('burseToken');
  res.status(200).send('Logged out!');
  res.redirect('/login');
});

app.post('/trade', validateToken, (req,res) =>{
  let newOrder = {id: tradeIdCounter, owner: req.user.id, type: req.body.tradeType, share: req.body.shareName, amount: req.body.amount, price: req.body.pricePerUnit};
  
  jsonData.requests.forEach(item => {
    if(item.owner === newOrder.owner && item.share === newOrder.share){
      res.status(400).send("There is already an open request for that share for your account.");
    }
  });

  jsonData.requests.push(newOrder);
  tradeIdCounter++;
  // fs.writeFile('./BurseJson.json', JSON.stringify(jsonData, null, 2), (err) => {
  //   if (err) {
  //     console.error('Error writing file:', err);
  //     return;
  //   }
  //   console.log('New item added to data.json');
  // });
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
