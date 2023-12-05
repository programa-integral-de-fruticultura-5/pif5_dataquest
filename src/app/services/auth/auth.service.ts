import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api/api.service';
import { HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Authentication } from '@models/Auth.namespace';
import { userBuilder } from '@utils/builder';
import { Observable, from, map } from 'rxjs';

const TOKEN_STORAGE_KEY = 'TOKEN_KEY';
const USER_STORAGE_KEY = 'USER_KEY';
const ENDPOINT = 'auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements Authentication.AuthManagement {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtHelperService: JwtHelperService
  ) {}

  public async getToken(): Promise<string | null> {
    const token = await Preferences.get({ key: TOKEN_STORAGE_KEY });
    return token.value || null;
  }

  public async getUser(): Promise<Authentication.User> {
    const { value } = await Preferences.get({ key: USER_STORAGE_KEY })
    return JSON.parse(value!) as Authentication.User;
  }

  private setUser(user: Authentication.User) {
    this.removeUser();
    const options = { key: USER_STORAGE_KEY, value: JSON.stringify(user) };
    Preferences.set(options);
  }

  private removeUser() {
    Preferences.remove({ key: USER_STORAGE_KEY });
  }

  private setToken(token: string) {
    this.removeToken();
    const options = { key: TOKEN_STORAGE_KEY, value: token };
    Preferences.set(options);
  }

  public removeToken() {
    Preferences.remove({ key: TOKEN_STORAGE_KEY });
  }

  public async decodeToken(token: string): Promise<boolean> {
    if (token) {
      return jwt_decode(token);
    }
    return false;
  }

  public async login(
    authParams: Authentication.AuthParams
  ): Promise<Authentication.User> {
    const response: HttpResponse = await this.apiService.post(
      ENDPOINT,
      authParams
    );
    console.log(response);
    if (response.status !== 200) {
      throw new Error(response.data.error);
    }
    const authResponse: Authentication.AuthResponse =
      response.data as Authentication.AuthResponse;
    this.setToken(authResponse.token);
    const user: Authentication.User = userBuilder(authResponse.user);
    this.setUser(user);
    this.router.navigate(['/home']);
    return user;
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
