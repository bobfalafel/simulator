import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  template: `
    <app-navbar [isLoggedIn]="isLoggedIn"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'trader-app';
  isLoggedIn = false; // Initialize based on your authentication logic

  constructor(private authService: AuthService) {
    authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn; // Update isLoggedIn when AuthService changes
    });
  }
}
