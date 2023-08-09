import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  requests: any[] = []; // Array to hold the requests data

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // When the component initializes, make an HTTP GET request to fetch the requests data
    this.http
      .get<any[]>('http://localhost:3000/requests', {
        withCredentials: true,
      })
      .subscribe(
        (data) => {
          this.requests = data; // Assign the fetched data to the 'requests' array
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
