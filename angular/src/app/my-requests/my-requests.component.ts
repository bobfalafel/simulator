import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css'],
})
export class MyRequestsComponent implements OnInit {
  requests: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('http://localhost:3000/my-requests', {
        withCredentials: true,
      })
      .subscribe((data) => {
        this.requests = data;
      });
  }

  removeRequest(idToDelete: number) {
    this.http
      .post(
        'http://localhost:3000/my-requests',
        { id: idToDelete },
        { observe: 'response', withCredentials: true }
      )
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    window.location.reload();
  }
}
