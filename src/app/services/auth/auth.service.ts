import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';

const TOKEN_KEY = "TOKEN_KEY";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public decodeToken(): string | null {
    const token = this.getToken();
    if (token) {
      return jwt_decode(token as string);
    }
    return null;
  }

  public logout(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
