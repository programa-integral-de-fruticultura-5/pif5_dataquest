import { Component, ViewChild } from '@angular/core';
import { AlertButton, AlertController, IonicModule } from '@ionic/angular';
import { IonicSafeString } from '@ionic/angular/standalone';
import { AuthService } from '@services/auth/auth.service';
import { SurveyService } from '@services/survey/survey.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {

  @ViewChild('modal') modal!: HTMLIonModalElement;

  constructor(
    private surveyService: SurveyService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async uploadSurveys() {

    const logoutAlert = await this.alertController.create({
      header: 'Sincronizar',
      message: 'Este proceso puede tardar. ¿Estás seguro que deseas sincronizar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sincronizar',
          handler: () => {
            this.surveyService.syncSurveys();
          },
        },
      ],
    })

    await logoutAlert.present();
  }

  async logout() {

    const logoutAlert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'logout',
          handler: () => {
            this.authService.logout();
            this.modal.dismiss();
          },
        },
      ],
    })

    await logoutAlert.present();
  }

  getUsername(): string {
    return this.authService.user?.name || '';
  }

  getRole(): string {
    return this.authService.user?.type || '';
  }

  getAppVersion(): string {
    return env.appVersion;
  }
}
