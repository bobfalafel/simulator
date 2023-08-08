import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  requests: any[] = []; // Array to hold the requests data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // When the component initializes, make an HTTP GET request to fetch the requests data
    this.http.get<any[]>('http://localhost:3000/requests').subscribe((data) => {
      this.requests = data; // Assign the fetched data to the 'requests' array
    });
  }
}
