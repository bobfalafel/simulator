import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  id = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http
      .post(
        'http://localhost:3000/login',
        { id: this.id },
        { observe: 'response', withCredentials: true }
      )
      .subscribe(
        (response) => {
          console.log(response); // Handle response
          this.router.navigate(['/home']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
