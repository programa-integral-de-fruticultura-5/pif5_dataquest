import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router) {}

  async canActivate() {

    const Logged = await this.authService.isLogged();

    if (Logged) {
      this.router.navigate(['/home']);
    }

    return true;
  }
}
