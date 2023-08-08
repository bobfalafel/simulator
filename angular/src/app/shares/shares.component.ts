import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.css'],
})
export class SharesComponent implements OnInit {
  shares: any[] = []; // Initialize an empty array to hold share data

  constructor(private http: HttpClient) {} // Inject the HttpClient service

  ngOnInit() {
    // Fetch share data from the server when the component initializes
    this.http.get<any[]>('http://localhost:3000/shares').subscribe((data) => {
      this.shares = data; // Assign the fetched data to the 'shares' array
    });
  }
}
