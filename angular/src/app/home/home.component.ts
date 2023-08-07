import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loggedTrader: any;
  tradeType = 'buy';
  shareName = 'Share A';
  amount: number = 0;
  pricePerUnit: number = 0;
  overallPrice: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http
      .get('http://localhost:3000/home', { withCredentials: true })
      .subscribe(
        (response) => {
          this.loggedTrader = response;
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  handleError(error: any) {
    if (error.status === 401) {
      // Redirect to the desired URL (e.g., login page)
      this.router.navigate(['/login']);
    } else {
      // Handle other error cases
      console.error('An error occurred:', error);
    }
  }

  submitForm() {
    const tradeData = {
      tradeType: this.tradeType,
      shareName: this.shareName,
      amount: this.amount,
      pricePerUnit: this.pricePerUnit,
      overallPrice: this.overallPrice,
    };

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
  }

  calculateOverallPrice() {
    if (this.amount && this.pricePerUnit) {
      this.overallPrice = this.amount * this.pricePerUnit;
    } else {
      this.overallPrice = 0;
    }
  }
}
