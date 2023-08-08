import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  id = ''; // Stores the trader's ID

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    // Initiates the login process when the login button is clicked
    this.http
      .post(
        'http://localhost:3000/login', // Sending the login request to the server
        { id: this.id }, // Sending the trader's ID to the server
        { observe: 'response', withCredentials: true } // Observes the full HTTP response including headers, uses credentials for CORS
      )
      .subscribe(
        (response) => {
          console.log(response); // Log the response (for debugging or handling)
          console.log(this.authService.isLoggedIn$); // Log the logged-in status from the AuthService
          this.authService.setLoggedIn(true); // Set the logged-in status using the AuthService
          this.router.navigate(['/home']); // Navigate to the home page upon successful login
        },
        (error) => {
          console.log(error); // Log any errors that occur during the login process
        }
      );
  }
}
