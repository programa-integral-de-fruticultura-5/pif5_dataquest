import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SecureInnerPagesGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {

    const logged = this.authService.isLogged();

    if (!logged) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }

    return true;
  }
}
