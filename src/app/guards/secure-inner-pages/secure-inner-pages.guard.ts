import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SecureInnerPagesGuard {

  constructor(
    public authService: AuthService,
    public router: Router,
    private jwtHelper: JwtHelperService

  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.getToken() && !this.jwtHelper.isTokenExpired(this.authService.getToken())) {
      this.router.navigate(['/tabs']);  //TODO review route when routes are finished
    }

    return true
  }
}
