import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
      IonicModule.forRoot({}),
      IonicStorageModule.forRoot(),
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['192.168.1.36:8060'],
        },
      })
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
});

function tokenGetter() {
  return window.sessionStorage.getItem('TOKEN_KEY');
}
