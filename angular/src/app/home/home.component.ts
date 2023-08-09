import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loggedTrader: any; // To store the logged-in trader's information
  shares: any[] = []; // To store the list of available shares
  ownedShares: any[] = []; // To store the list of shares owned by the trader

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Fetch trader's information and share data when component initializes
    this.http
      .get('http://localhost:3000/home', { withCredentials: true }) // Fetch user's data with credentials
      .subscribe(
        (response) => {
          // Successful response handling
          this.loggedTrader = response; // Store the trader's information

          // Fetch the list of available shares
          this.http
            .get<any[]>('http://localhost:3000/shares', {
              withCredentials: true,
            })
            .subscribe((data) => {
              this.shares = data; // Store the list of shares

              // Modify owned shares data to display share names
              if (
                this.loggedTrader.shares &&
                this.loggedTrader.shares.length > 0
              ) {
                this.loggedTrader.shares.forEach((ownedShare: any) => {
                  let tempshare = this.shares.find(
                    (share) => share.id === ownedShare.id
                  );
                  if (tempshare) {
                    ownedShare.id = tempshare.name; // Replace share ID with share name
                  }
                });
              }
              this.ownedShares = this.loggedTrader.shares; // Store the owned shares data
            });
        },
        (error) => {
          // Handle error cases
          this.handleError(error);
        }
      );
  }

  handleError(error: any) {
    if (error.status === 401) {
      // If unauthorized (status code 401), redirect to the login page
      this.router.navigate(['/login']);
    } else {
      // Handle other error cases
      console.error('An error occurred:', error);
    }
  }
}
