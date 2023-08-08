const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const validateToken = require('./middleware/auth'); // Custom token validation middleware
const port = 3000;
const tokenValidator = 'tokenMaster'; // Token validation secret
const jsonData = require('../BurseJson.json'); // JSON data containing traders, shares, and requests
const cookieParser = require('cookie-parser');
const cors = require('cors'); // CORS middleware for handling cross-origin requests
const fs = require('fs');

let tradeIdCounter = 1; // Initialize the counter with a starting value

// Function to initialize unique trade IDs
function initializeTradeIds(){
  jsonData.requests.forEach(item => {
    item.id = tradeIdCounter; // Assign a unique ID
    tradeIdCounter++; // Increment the counter for the next use
  });
}

// Function to perform a buy trade
function performBuyTrade(buyer, seller, share, item) {
  // Update share price and trader money
  jsonData.shares[jsonData.shares.indexOf(share)].currentPrice = item.price;
  jsonData.traders[jsonData.traders.indexOf(buyer)].money -= item.amount * item.price;

  // Initialize shares array if not exists
  if (!buyer.shares) {
    buyer.shares = []; // Initialize the shares property if it's undefined
  }

  // Find or add shares to the buyer
  let existingShare = buyer.shares.find(s => s.id === share.id);
  if (existingShare) {
    existingShare.amount += item.amount;
  } else {
    buyer.shares.push({ id: share.id, amount: item.amount });
  }

  // Update share amount
  jsonData.shares[jsonData.shares.indexOf(share)].amount -= item.amount;
  seller.money += item.amount * item.price;
}

// Function to perform a sell trade
function performSellTrade(seller, share, item) {
  // Find the existing share
  let existingShare = seller.shares.find(s => s.id === share.id);
  if (existingShare && existingShare.amount >= item.amount) {
    // Update share price
    jsonData.shares[jsonData.shares.indexOf(share)].currentPrice = item.price;

    // Update share amount and trader money
    existingShare.amount -= item.amount;
    if (existingShare.amount === 0) {
      seller.shares = seller.shares.filter(s => s.id !== share.id);
    }

    jsonData.shares[jsonData.shares.indexOf(share)].amount += item.amount;
  }
}

// Function to perform trades
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

      if (item.type === "sell" && item.price <= share.currentPrice) {
        let existingShare = buyer.shares.find(s => s.id === share.id);
        if (existingShare && existingShare.amount >= item.amount) {
          jsonData.shares[jsonData.shares.indexOf(share)].currentPrice = item.price;
          jsonData.traders[jsonData.traders.indexOf(buyer)].money += item.amount * item.price;

          existingShare.amount -= item.amount; // Subtract sold amount
          if (existingShare.amount == 0) {
            buyer.shares = buyer.shares.filter(s => s.id !== share.id);
          }
          jsonData.shares[jsonData.shares.indexOf(share)].amount += item.amount;
          jsonData.requests = jsonData.requests.filter(request => request.id != item.id);
        }
      }
    }
  });
}

// Initial trade processing and data setup
preformTrades();
initializeTradeIds();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // The exact origin of your Angular app
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions));

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Function to generate a random number within a specified range
function generateRandomInRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to change share prices randomly within a 10% range
function changeShares() { 
  for(let i=0; i<jsonData.shares.length;i++){
    // Add or subtract a random value up to 10% of the current price
    jsonData.shares[i].currentPrice += Math.round(generateRandomInRange(-1 * (jsonData.shares[i].currentPrice/10+1), jsonData.shares[i].currentPrice/10+1))+1;
  }

  // Perform trades and save updated data
  preformTrades();
  fs.writeFile('../BurseJson.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
       return;
    }
  });
}

// Interval for changing shares every 10 seconds
const interval = 10000; // 10 seconds in milliseconds
const intervalId = setInterval(changeShares, interval);

// Route to handle login attempts
app.post('/login', async (req, res) => {
  const trader = jsonData.traders.find(trader => trader.id === req.body.id);
  if (!trader) return res.status(400).send('Trader not found.');
  try {
    // Generate a JWT token and send it in a cookie
    const token = jwt.sign({ id: trader.id }, tokenValidator);
    res.cookie('burseToken', token, {sameSite: 'none', secure: true});
    res.send({data:'logged in!'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to display the user's home page
app.get('/home', validateToken, async (req, res) => {
    const loggedTrader = req.user;
    res.send(loggedTrader);
});

// Route to make a request (with validation)
app.get('/make-request', validateToken, async (req, res) => {
    const loggedTrader = req.user;
    res.send(loggedTrader);
});

// Route to fetch the list of shares
app.get('/shares', (req, res) =>{
  res.send(jsonData.shares);
});

// Route to fetch the list of traders
app.get('/traders', (req, res) =>{
  res.send(jsonData.traders);
});

// Route to fetch and send modified requests data
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

// Route to perform logout (with validation)
app.get('/logout', validateToken, (req, res) =>{
  res.clearCookie('burseToken');
  res.status(200).send('Logged out!');
  res.redirect('/login');
});

// Route to create a new trade request (with validation)
app.post('/trade', validateToken, (req,res) =>{
  // Create a new trade order based on request data
  let newOrder = {id: tradeIdCounter, owner: req.user.id, type: req.body.tradeType, share: req.body.shareName, amount: req.body.amount, price: req.body.pricePerUnit};
  let hasDuplicate =false;

  // Check for duplicate open requests
  jsonData.requests.forEach(item => {
    if(item.owner === newOrder.owner && item.share === newOrder.share){
      hasDuplicate = true;
    }
  });

  // Validate and process the new trade order
  if(newOrder.type === "sell"){
    // Validation for sell orders
        try {
            let ownedShares = req.user.shares.find(share => share.id === newOrder.share);
            if (ownedShares && ownedShares.amount < newOrder.amount) {
                throw new Error("You don't own enough shares to sell");
            }
        } catch {
            res.status(400).send("You don't own enough shares to sell");
            return;
        }
  }
  else{
    // Validation for buy orders
    if (newOrder.amount * newOrder.price > req.user.money) {
        res.status(400).send("You don't own enough money to buy");
        return;
    }
  }

  
  // Further validations and processing
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

  // Add the new trade order to the requests
  jsonData.requests.push(newOrder);
  tradeIdCounter++;

  // Perform trades and save updated data
  preformTrades();
  fs.writeFile('../BurseJson.json', JSON.stringify(jsonData, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
       return;
    }
  });

  // Respond with success
  res.status(200).send({ body: 'Trade order created successfully' });

})

// Route to fetch user's trade requests (with validation)
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

// Route to delete a specific trade request of the user (with validation)
app.post('/my-requests', validateToken, (req, res) =>{
  // Filter out the specified trade request from the user's requests
  jsonData.requests =jsonData.requests.filter(request => request.id != req.body.id);
  // Respond with success
  res.status(200).send({ body: 'Trade request deleted successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
