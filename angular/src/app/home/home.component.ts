import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  loggedTrader: any;
  shares: any[] = [];
  ownedShares: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http
      .get('http://localhost:3000/home', { withCredentials: true })
      .subscribe(
        (response) => {
          this.loggedTrader = response;
          this.http
            .get<any[]>('http://localhost:3000/shares')
            .subscribe((data) => {
              this.shares = data;
              if (
                this.loggedTrader.shares &&
                this.loggedTrader.shares.length > 0
              ) {
                this.loggedTrader.shares.forEach((ownedShare: any) => {
                  let tempshare = this.shares.find(
                    (share) => share.id === ownedShare.id
                  );
                  if (tempshare) {
                    ownedShare.id = tempshare.name;
                  }
                });
              }
              this.ownedShares = this.loggedTrader.shares;
            });
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
}
