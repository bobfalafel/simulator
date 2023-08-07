import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoggedInStatus(); // Check authentication status on service initialization
  }

  private checkLoggedInStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }

  setLoggedIn(value: boolean) {
    localStorage.setItem('isLoggedIn', value.toString()); // Save in localStorage
    this.isLoggedInSubject.next(value);
  }

  logout() {
    this.setLoggedIn(false);
    return this.http
      .get('http://localhost:3000/logout', {
        withCredentials: true,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
