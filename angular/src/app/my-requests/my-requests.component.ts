import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html', // HTML template file
  styleUrls: ['./my-requests.component.css'], // Stylesheet file
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = []; // Array to store requests

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Fetch the logged-in user's requests from the server
    this.http
      .get<any[]>('http://localhost:3000/my-requests', {
        withCredentials: true, // Include cookies for authentication
      })
      .subscribe(
        (data) => {
          this.requests = data; // Store fetched requests in the component property
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  // Function to remove a request
  removeRequest(idToDelete: number) {
    // Send a request to the server to delete the specified request
    this.http
      .post(
        'http://localhost:3000/my-requests',
        { id: idToDelete }, // Include the ID of the request to delete
        { observe: 'response', withCredentials: true } // Include cookies for authentication
      )
      .subscribe(
        (response) => {
          console.log(response); // Handle success response
        },
        (error) => {
          console.log(error); // Handle error response
        }
      );
    window.location.reload(); // Reload the page to reflect changes
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
