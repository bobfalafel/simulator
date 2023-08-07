import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  id = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

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
          console.log(this.authService.isLoggedIn$);
          this.authService.setLoggedIn(true);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
