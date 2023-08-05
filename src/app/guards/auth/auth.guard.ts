import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    public authService: AuthService,
    public router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const decodedToken = this.authService.decodeToken();

    if (!decodedToken || this.jwtHelper.isTokenExpired(this.authService.getToken())) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }

    return true;
  }

}
