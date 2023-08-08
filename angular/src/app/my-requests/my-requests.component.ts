import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html', // HTML template file
  styleUrls: ['./my-requests.component.css'], // Stylesheet file
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = []; // Array to store requests

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch the logged-in user's requests from the server
    this.http
      .get<any[]>('http://localhost:3000/my-requests', {
        withCredentials: true, // Include cookies for authentication
      })
      .subscribe((data) => {
        this.requests = data; // Store fetched requests in the component property
      });
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
}
