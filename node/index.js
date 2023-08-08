const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateToken = require('./middleware/auth');
const port = 3000;
const tokenValidator = 'tokenMaster';
const jsonData = require('../BurseJson.json');
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



function performBuyTrade(buyer, seller, share, item) {
  jsonData.shares[jsonData.shares.indexOf(share)].currentPrice = item.price;
  jsonData.traders[jsonData.traders.indexOf(buyer)].money -= item.amount * item.price;

  if (!buyer.shares) {
    buyer.shares = []; // Initialize the shares property if it's undefined
  }

  let existingShare = buyer.shares.find(s => s.id === share.id);
  if (existingShare) {
    existingShare.amount += item.amount;
  } else {
    buyer.shares.push({ id: share.id, amount: item.amount });
  }

  jsonData.shares[jsonData.shares.indexOf(share)].amount -= item.amount;
  seller.money += item.amount * item.price;
}

function performSellTrade(seller, share, item) {
  let existingShare = seller.shares.find(s => s.id === share.id);
  if (existingShare && existingShare.amount >= item.amount) {
    jsonData.shares[jsonData.shares.indexOf(share)].currentPrice = item.price;

    existingShare.amount -= item.amount;
    if (existingShare.amount === 0) {
      seller.shares = seller.shares.filter(s => s.id !== share.id);
    }

    jsonData.shares[jsonData.shares.indexOf(share)].amount += item.amount;
  }
}

function preformTrades() {
  jsonData.requests.forEach(item => {
    let share = jsonData.shares.find(share => share.id === item.share);
    let buyer = jsonData.traders.find(trader => trader.id === item.owner);

    if (share && buyer) {
      if (item.type === "buy" && item.price >= share.currentPrice) {
        // Check if there's a corresponding sell request
        let sellRequest = jsonData.requests.find(request =>
          request.type === "sell" &&
          request.share === item.share &&
          request.price <= item.price
        );

        if (sellRequest) {
          let seller = jsonData.traders.find(trader => trader.id === sellRequest.owner);
          if (seller) {
            performSellTrade(seller, share, sellRequest);
            performBuyTrade(buyer, seller, share, item);
            jsonData.requests = jsonData.requests.filter(request =>
              request.id !== item.id && request.id !== sellRequest.id
            );
          }
        } else {
          performBuyTrade(buyer, share, item);
          jsonData.requests = jsonData.requests.filter(request => request.id !== item.id);
        }
      }
    }
  });
}



preformTrades();
initializeTradeIds();

const corsOptions = {
  origin: 'http://localhost:4200', // Specify the exact origin of your Angular app
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

let traders = jsonData.traders;

function generateRandomInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeShares() { //adds or subtracts up to 10% of each share randomly
  for(let i=0; i<jsonData.shares.length;i++){
    jsonData.shares[i].currentPrice += Math.round(generateRandomInRange(-1 * (jsonData.shares[i].currentPrice/10+1), jsonData.shares[i].currentPrice/10+1))+1;
  }
  preformTrades();
  fs.writeFile('../BurseJson.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
       return;
    }
  });
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

app.get('/make-request', validateToken, async (req, res) => {
    const loggedTrader = req.user;
    res.send(loggedTrader);
});


app.get('/shares', (req, res) =>{
  res.send(jsonData.shares);
});

app.get('/traders', (req, res) =>{
  res.send(traders);
});

app.get('/requests', (req, res) =>{
  let sendRequests = [];
  jsonData.requests.forEach(item => {
    const ownerTrader = jsonData.traders.find(trader => trader.id === item.owner);
    const tempShare = jsonData.shares.find(share => share.id === item.share);
    if (ownerTrader && tempShare) {
      // Create a copy of the item to avoid modifying the original data
      const tempItem = { ...item };
      
      // Assign the trader's name to the owner property
      tempItem.owner = ownerTrader.name;
      tempItem.share = tempShare.name;
      // Push the modified item to the sendRequests array
      sendRequests.push(tempItem);
    }
  });
  res.send(sendRequests);
});

app.get('/logout', validateToken, (req, res) =>{
  res.clearCookie('burseToken');
  res.status(200).send('Logged out!');
  res.redirect('/login');
});

app.post('/trade', validateToken, (req,res) =>{
  let newOrder = {id: tradeIdCounter, owner: req.user.id, type: req.body.tradeType, share: req.body.shareName, amount: req.body.amount, price: req.body.pricePerUnit};
  let hasDuplicate =false;

  if(newOrder.type === "sell"){
    try{
      let ownedShares = req.user.shares.find(share => share.id === newOrder.share);
      if(ownedShares){
        if(ownedShares.amount < newOrder.amount){
          throw new Error("This is the error message.");
        }
      }
    }
    catch{
      res.status(400).send("You don't own enough shares to sell");
      return;
    }
  }
  else{
    if(newOrder.amount* newOrder.price > req.user.money){
      res.status(400).send("You don't own enough money to buy");
      return;
    }
  }

  jsonData.requests.forEach(item => {
    if(item.owner === newOrder.owner && item.share === newOrder.share){
      hasDuplicate = true;
    }
  });
  
  if (newOrder.price == 0){
    res.status(400).send("Price cannot be 0.");
    return;
  }
  else if( newOrder.amount == 0){
    res.status(400).send("Amount cannot be 0.");
    return
  }
  else if(hasDuplicate){
    res.status(400).send("There is already an open request for that share for your account.");
    return;
  }
  jsonData.requests.push(newOrder);
  tradeIdCounter++;
  //TODO this works just un// it so it can save :)
  preformTrades();
  fs.writeFile('../BurseJson.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
       return;
    }
  });
})

app.get('/my-requests', validateToken, (req, res) =>{
  let userRequests = [];
  jsonData.requests.forEach(item => {
    if(item.owner === req.user.id){
      let tempItem = {...item};
      let tempShare = jsonData.shares.find(share => share.id === item.share);
      if(tempShare){
        tempItem.share = tempShare.name;
      }
      userRequests.push(tempItem);
    }
  });
  res.status(200).send(userRequests);
});

app.post('/my-requests', validateToken, (req, res) =>{
  jsonData.requests =jsonData.requests.filter(request => request.id != req.body.id);
  res.status(200).send({body:'did good'});
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
