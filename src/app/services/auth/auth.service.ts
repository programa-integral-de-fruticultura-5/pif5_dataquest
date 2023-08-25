import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { HttpResponse } from '@capacitor/core';

const TOKEN_KEY = "TOKEN_KEY";
const ENDPOINT = "auth/login"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private api: ApiService
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
      return jwt_decode(token);
    }
    return null;
  }

  public login(credentials: { email: string, password: string }): Promise<HttpResponse> {
    return this.api.post(ENDPOINT, credentials)
  }

  public logout(): void {
    window.sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
