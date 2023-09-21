import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api/api.service';
import { HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_KEY = 'TOKEN_KEY';
const ENDPOINT = 'auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private api: ApiService,
    private jwtHelperService: JwtHelperService
  ) {}

  public saveToken(token: string) {
    this.removeToken();
    const options = { key: TOKEN_KEY, value: token };
    Preferences.set(options);
  }

  public async getToken(): Promise<string | null> {
    const token = await Preferences.get({ key: TOKEN_KEY });
    return token.value || null;
  }

  public removeToken() {
    Preferences.remove({ key: TOKEN_KEY });
  }

  public async decodeToken(token: string): Promise<boolean> {
    if (token) {
      return jwt_decode(token);
    }
    return false;
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Promise<HttpResponse> {
    return this.api.post(ENDPOINT, credentials);
  }

  public logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  public async isLogged(): Promise<boolean> {
    const token = (await this.getToken()) as string;
    const decodedToken = await this.decodeToken(token);
    return decodedToken && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelperService.isTokenExpired(token);
  }
}
