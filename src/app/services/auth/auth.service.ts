import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ApiService } from '../api/api.service';
import { HttpResponse } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/models/user';
import { UserResponse } from 'src/app/types/userResponse';

const TOKEN_KEY = 'TOKEN_KEY';
const USER_KEY = 'USER_KEY';
const ENDPOINT = 'auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user!: User;

  constructor(
    private router: Router,
    private api: ApiService,
    private jwtHelperService: JwtHelperService
  ) {
    this.user = this.getUser() as User;
  }

  public saveToken(token: string) {
    this.removeToken();
    const options = { key: TOKEN_KEY, value: token };
    Preferences.set(options);
  }

  public saveUser(user: UserResponse) {
    this.removeUser();
    const newUser = new User(
      user.id,
      user.name,
      user.email,
      user.email_verified_at,
      user.cedula,
      user.roles,
      user.types,
      user.zone,
      user.created_at,
      user.updated_at
    );
    this.user = newUser;
    this.storeUser(newUser);
  }

  public async getToken(): Promise<string | null> {
    const token = await Preferences.get({ key: TOKEN_KEY });
    return token.value || null;
  }

  public getUser(): User | null {
    var user: User | null = null;
    Preferences.get({ key: USER_KEY }).then(
      (response) => (user = JSON.parse(response.value!))
    ).catch((error) => console.log(error));
    return user;
  }

  public removeToken() {
    Preferences.remove({ key: TOKEN_KEY });
  }

  private storeUser(user: User) {
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
