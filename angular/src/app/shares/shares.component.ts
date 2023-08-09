import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.css'],
})
export class SharesComponent implements OnInit {
  shares: any[] = []; // Initialize an empty array to hold share data

  constructor(private http: HttpClient, private router: Router) {} // Inject the HttpClient service

  ngOnInit() {
    // Fetch share data from the server when the component initializes
    this.http
      .get<any[]>('http://localhost:3000/shares', {
        withCredentials: true,
      })
      .subscribe(
        (data) => {
          this.shares = data; // Assign the fetched data to the 'shares' array
        },
        (error) => {
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
