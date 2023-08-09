import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-traders',
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.css'],
})
export class TradersComponent implements OnInit {
  traders: any[] = []; // Initialize an empty array to store traders' data

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // When the component initializes...
    this.http
      .get<any[]>('http://localhost:3000/traders', {
        withCredentials: true,
      })
      .subscribe(
        (data) => {
          // Use the HttpClient to make an HTTP GET request to fetch traders' data
          this.traders = data; // Assign the fetched traders' data to the 'traders' array
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
