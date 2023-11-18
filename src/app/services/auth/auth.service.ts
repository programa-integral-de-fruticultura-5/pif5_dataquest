import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api/api.service';
import { HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Authentication } from '@models/Auth.namespace';
import { userBuilder } from '@utils/builder';

const TOKEN_KEY = 'TOKEN_KEY';
const USER_KEY = 'USER_KEY';
const ENDPOINT = 'auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements Authentication.AuthManagement {
  user!: Authentication.User;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private jwtHelperService: JwtHelperService
  ) { }

  public saveToken(token: string) {
    this.removeToken();
    const options = { key: TOKEN_KEY, value: token };
    Preferences.set(options);
  }

  public saveUser(user: Authentication.User) {
    this.removeUser();
    console.log(this.user);
    this.storeUser(user);
  }

  public async getToken(): Promise<string | null> {
    const token = await Preferences.get({ key: TOKEN_KEY });
    return token.value || null;
  }

  public loadUser(): void{
    Preferences.get({ key: USER_KEY }).then(
      (response) => (
        console.log(response),
        this.user = JSON.parse(response.value!)
      )
    ).catch((error) => console.log(error));
  }

  public removeToken() {
    Preferences.remove({ key: TOKEN_KEY });
  }

  private storeUser(user: Authentication.User) {
    const options = { key: USER_KEY, value: JSON.stringify(user) };
    Preferences.set(options);
  }

  private removeUser() {
    Preferences.remove({ key: USER_KEY });
  }

  public async decodeToken(token: string): Promise<boolean> {
    if (token) {
      return jwt_decode(token);
    }
    return false;
  }

  public async login(authParams: Authentication.AuthParams): Promise<Authentication.User> {
    const response: HttpResponse = await this.apiService.post(ENDPOINT, authParams);
    console.log(response);
    const authResponse: Authentication.AuthResponse = response.data as Authentication.AuthResponse;
    this.saveToken(authResponse.token);
    const user: Authentication.User = userBuilder(authResponse.user);
    this.saveUser(user);
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
