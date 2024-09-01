import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCo from '@angular/common/locales/es-CO';
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
import { CurrencyPipe } from '@angular/common';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Drivers } from '@ionic/storage';
import { DraftService } from '@services/draft/draft.service';
import { MockDraftService } from '@services/draft/draft.service mock';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(localeEsCo);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: DraftService, useClass: environment.mockServices ? MockDraftService : DraftService },
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: CurrencyPipe, useClass: CurrencyPipe },
    importProvidersFrom(
      IonicModule.forRoot({}),
      IonicStorageModule.forRoot({
        driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
      }),
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
