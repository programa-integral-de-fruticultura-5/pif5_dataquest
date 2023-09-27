import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';

const ENDPOINT = 'uploadSurveys';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Form[];

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private storageService: StorageService
  ) {
    this.surveys = [];
    this.loadSurveys();
  }

  public pushSurvey(survey: Form): void {
    const copy = { ...survey };
    this.surveys.push(copy);
  }

  public loadSurveys(): void {
    this.storageService.get('surveys')?.then((surveys) => {
      if (surveys) {
        this.surveys = surveys;
      }
    });
  }

  public getSurveys(): Form[] {
    return this.surveys;
  }

  public saveSurveys(): void {
    this.storageService.set('surveys', this.surveys);
  }

  async syncSurveys() {
    const { connected } = await Network.getStatus();
    if (connected) {
      this.surveys.forEach((survey) => {
        this.apiService.post(ENDPOINT, survey).then((res) => {
          if (res.status === 200) {
            this.changeSyncStatus(survey, true);
          }
        }).catch(async (err) => {
          const serverAlert = await this.alertController.create({
            header: 'Problema con el servidor',
            subHeader: 'Error ' + err.status,
            message:
              'No se pudo establecer una conexión con el servidor. Por favor, intenta más tarde.',
            buttons: ['OK'],
          })
          serverAlert.present();
        });
      })
      this.saveSurveys()
    } else {
      const noInternetAlert = await this.alertController.create({
        header: 'No hay conexión a internet',
        message:
          'No se pudo establecer una conexión a internet. Por favor, verifica tu conexión a internet y vuelve a intentarlo.',
        buttons: ['OK'],
      });
      noInternetAlert.present();
    }
  }

  private changeSyncStatus(survey: Form, status: boolean): void {
    const index = this.surveys.indexOf(survey);
    this.surveys[index].sync = status;
  }
}
