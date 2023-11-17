import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';

const ENDPOINT = 'uploadSurveys';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: FormDetail.Form[];

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private storageService: StorageService
  ) {
    this.surveys = [];
    this.loadSurveys();
  }

  public pushSurvey(survey: FormDetail.Form): void {
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

  public getSurveys(): FormDetail.Form[] {
    return this.surveys;
  }

  public saveSurveys(): void {
    this.storageService.set('surveys', this.surveys);
  }

  async syncSurveys() {
    const { connected } = await Network.getStatus();
    if (connected) {
      this.surveys.forEach((survey) => {
        if (!survey.sync) {
          this.uploadSurvey(survey)
        }
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

  private changeSyncStatus(survey: FormDetail.Form, status: boolean): void {
    const index = this.surveys.indexOf(survey);
    this.surveys[index].sync = status; //TODO save into storage
  }

  private uploadSurvey(survey: FormDetail.Form): void {
    this.apiService.post(ENDPOINT, survey).then( (res) => {
      if (res.status === 200) {
        this.changeSyncStatus(survey, true);
      }/*  else {
        const serverResponseAlert = await this.alertController.create({
          header: 'Error en el servidor',
          subHeader: 'Error ' + res.status,
          message:
            'El servidor no pudo procesar la solicitud. Por favor, intenta más tarde.',
          buttons: ['OK'],
        });
        serverResponseAlert.present()
      } */
    })/* .catch(async (err) => {
      const serverAlert = await this.alertController.create({
        header: 'Problema con el servidor',
        subHeader: 'Error ' + err.status,
        message:
          'No se pudo establecer una conexión con el servidor. Por favor, intenta más tarde.',
        buttons: ['OK'],
      })
      serverAlert.present();
    }); */
  }
}
