# Angular Traders' Platform - Code Explanation

This repository contains the source code for an Angular application that simulates a traders' platform. The application includes various components for managing traders, shares, and trading requests.

## Code Explanation

I have decided that as a database I'll continue working on the given JSON
I added a few fields to keep myself orginized
to the traders I added another object called "ownedShares" that holds all the shares that trader holds on the format of {<shareID> : <shareAmountOwned>}
I also added a third list in the JSON that holds all open requests in the following format:
{'id':<request id>,
'owner':<trader id of whoever made the request>,
'type': <b for buying/s for selling>,
'share': <share id>,
'amount':<amount of shares to buy or sell>,
'price':<asking price>}

### Components

1. `home.component.ts`
   - Responsible for displaying the home page for logged-in traders.
   - Fetches trader information and owned shares.
   - Handles errors and redirects if not logged in.

2. `login.component.ts`
   - Implements the login functionality.
   - Submits trader ID to the server for authentication.
   - Handles successful and failed login attempts.

3. `make-request.component.ts`
   - Allows traders to make trading requests.
   - Fetches trader information and available shares.
   - Calculates the overall price and submits the request.

4. `my-requests.component.ts`
   - Displays a list of trading requests made by the trader.
   - Fetches the trader's requests and allows removal.

5. `navbar.component.ts`
   - Manages the navigation bar.
   - Controls visibility of navigation links based on login status.
   - Provides a logout function that updates login status.

6. `requests.component.ts`
   - Displays a list of all trading requests.
   - Fetches and lists all trading requests made by traders.

7. `shares.component.ts`
   - Displays a list of all available shares.
   - Fetches and lists shares with their current prices.

8. `traders.component.ts`
   - Displays a list of all traders.
   - Fetches and lists traders with their names and balances.

### Comments

The provided source code has been enhanced with comments to explain the purpose, functionality, and behavior of each component and its associated code blocks. Comments have been added to clarify the roles of functions, variables, and API calls, making the code more readable and understandable.

### Running the Application

To run the Angular application:

1. Install Node.js and Angular CLI if not already installed.
2. Clone this repository to your local machine.
3. Navigate to the project directory in the terminal.
4. Run `npm install` to install project dependencies.
5. Run `ng serve` to start the development server.
6. Open a web browser and navigate to `http://localhost:4200` to access the application.

### Note

This code is provided as an example and may need additional configuration, error handling, and security enhancements for production use. Always ensure that you follow best practices for security and code quality when building real-world applications.
