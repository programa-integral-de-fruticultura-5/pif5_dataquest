import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { Authentication } from '@models/Auth.namespace';
import { AuthService } from '@services/auth/auth.service';
import { SurveyService } from '@services/survey/survey.service';
import { App } from '@capacitor/app';
import { ProducerService } from '@services/producer/producer.service';
import { DraftService } from '@services/draft/draft.service';
import { AssociationService } from '@services/association/association.service';
import { Logger, LoggingService, LogMessage } from 'ionic-logging-service';
import { FilesystemService } from '@services/filesystem/filesystem.service';

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

  private logger: Logger;

  constructor(
    private surveyService: SurveyService,
    private alertController: AlertController,
    private authService: AuthService,
    private producerService: ProducerService,
    private platform: Platform,
    private draftService: DraftService,
    private associationService: AssociationService,
    private loggingService: LoggingService,
    private filesystemService: FilesystemService
  ) {
    this.logger = this.loggingService.getLogger('HomePage');
  }

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
      this.loadAssociations();
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

  // async logout() {
  //   const logoutAlert = await this.alertController.create({
  //     header: 'Cerrar Sesión',
  //     message: '¿Estás seguro que deseas cerrar sesión?',
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Cerrar Sesión',
  //         cssClass: 'logout',
  //         handler: () => {
  //           this.authService.logout();
  //           this.modal.dismiss();
  //         },
  //       },
  //     ],
  //   });

  //   await logoutAlert.present();
  // }

  saveLogs() {
    const methodName: string = 'saveLogs';
    this.logger.entry(methodName);
    const logMessages: LogMessage[] = this.loggingService.getLogMessages();
    const logs: string = logMessages.map(this.formatLogMessage).join('\n\n');
    const date: Date = new Date();
    const fileName = `logs/${date.toISOString()}.log`;
    this.filesystemService.writeFile(fileName, logs);
  }

  private formatLogMessage(logMessage: LogMessage): string {
    const timeStamp = logMessage.timeStamp.toISOString();
    const level = logMessage.level.toUpperCase();
    const logger = logMessage.logger;
    const methodName = logMessage.methodName;
    const messages = logMessage.message.map((msg) => `  - ${msg}`).join('\n');

    const formatedLogMessage: string = [
      `[${level}] ${timeStamp}`,
      `Logger: ${logger}`,
      `Method: ${methodName}`,
      `Messages:\n${messages}`,
    ].join('\n');

    return formatedLogMessage;
  }

  loadUser(): void {
    this.authService.getUser().then((user) => {
      this.user = user;
    });
  }

  private loadProducers(): void {
    this.producerService.updateProducers();
  }

  private loadAssociations(): void {
    this.associationService.updateAssociations();
  }

  getAppVersion(): string {
    return this.appVersion;
  }

  isSyncing(): boolean {
    return this.surveyService.isSyncing;
  }

  getCounter(): number {
    return this.surveyService.counter;
  }

  getSurveysToSyncLength(): number {
    return this.surveyService.getSurveys().filter((survey) => !survey.sync)
      .length;
  }

  getLoadingMessage(): string {
    return `Sincronizando encuestas... ${this.getCounter()} de ${this.getSurveysToSyncLength()}`;
  }
}
