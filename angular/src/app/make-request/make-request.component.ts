import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-request',
  templateUrl: './make-request.component.html',
})
export class MakeRequestComponent implements OnInit {
  shares: any[] = []; // Array to hold share data
  loggedTrader: any; // Holds logged trader data
  tradeType = 'buy'; // Default trade type
  shareName = ''; // Holds selected share name
  amount: number = 0; // Holds selected amount
  pricePerUnit: number = 0; // Holds selected price per unit
  overallPrice: number = 0; // Holds calculated overall price

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // Fetch logged trader data
    this.http
      .get('http://localhost:3000/make-request', {
        withCredentials: true,
      })
      .subscribe(
        (response) => {
          this.loggedTrader = response;
        },
        (error) => {
          this.handleError(error);
        }
      );

    // Fetch available shares data
    this.http
      .get<any[]>('http://localhost:3000/shares', {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.shares = data;
      });
  }

  // Handle error responses
  handleError(error: any) {
    if (error.status === 401) {
      // Redirect to the desired URL (e.g., login page)
      this.router.navigate(['/login']);
    } else {
      // Handle other error cases
      console.error('An error occurred:', error);
    }
  }

  // Submit trade request form
  submitForm() {
    const tradeData = {
      tradeType: this.tradeType,
      shareName: this.shareName,
      amount: this.amount,
      pricePerUnit: this.pricePerUnit,
      overallPrice: this.overallPrice,
    };

    // Send trade data to the server
    this.http
      .post('http://localhost:3000/trade', tradeData, { withCredentials: true })
      .subscribe(
        (response) => {
          console.log(response); // Handle success
        },
        (error) => {
          console.error(error.error); // Handle error
        }
      );

    // Reset form values
    this.tradeType = 'buy';
    this.shareName = '';
    this.amount = 0;
    this.pricePerUnit = 0;
    this.overallPrice = 0;
  }

  // Calculate overall price based on amount and price per unit
  calculateOverallPrice() {
    if (this.amount && this.pricePerUnit) {
      this.overallPrice = this.amount * this.pricePerUnit;
    } else {
      this.overallPrice = 0;
    }
  }
}
