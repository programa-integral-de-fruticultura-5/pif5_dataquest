import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { Authentication } from '@models/Auth.namespace';
import { AuthService } from '@services/auth/auth.service';
import { SurveyService } from '@services/survey/survey.service';
import { App } from '@capacitor/app';
import { ProducerService } from '@services/producer/producer.service';
import { DraftService } from '@services/draft/draft.service';

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
  appVersion!: string;

  constructor(
    private surveyService: SurveyService,
    private alertController: AlertController,
    private authService: AuthService,
    private producerService: ProducerService,
    private platform: Platform,
    private draftService: DraftService
  ) {}

  ngOnInit() {
    App.getInfo().then((info) => {
      this.appVersion = info.version;
    });
  }

  ionViewDidEnter() {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.loadProducers();
      this.loadUser();
      this.surveyService.getNetworkStatus();
      this.surveyService.addNetworkChangeListener();
      this.surveyService.getLocalSurveys();
      this.draftService.getLocalDrafts();
    });
  }

  async uploadSurveys() {
    const logoutAlert = await this.alertController.create({
      header: 'Sincronizar',
      message:
        'Este proceso puede tardar. ¿Estás seguro que deseas sincronizar?',
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
    });

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
    });

    await logoutAlert.present();
  }

  loadUser(): void {
    this.authService.getUser().then((user) => {
      this.user = user;
    });
  }

  private loadProducers(): void {
    this.producerService.updateProducers();
  }

  getAppVersion(): string {
    return this.appVersion;
  }
}
