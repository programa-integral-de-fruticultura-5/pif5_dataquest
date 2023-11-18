import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { Authentication } from '@models/Auth.namespace';
import { AuthService } from '@services/auth/auth.service';
import { SurveyService } from '@services/survey/survey.service';
import { environment as env } from 'environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {

  @ViewChild('modal') modal!: HTMLIonModalElement;

  user!: Authentication.User;

  constructor(
    private surveyService: SurveyService,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

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

  loadUser(): void {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  getAppVersion(): string {
    return env.appVersion;
  }
}
