import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn = false; // Initialize isLoggedIn as false

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to isLoggedIn$ observable from the AuthService
    authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn; // Update isLoggedIn when AuthService changes
    });
  }

  logout() {
    this.authService.logout(); // Call the logout method in AuthService

    // Preserve the current route while refreshing the component
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/login']); // Navigate back to the login route
    });
  }
}
