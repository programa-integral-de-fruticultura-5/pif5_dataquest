import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { Observable, catchError, forkJoin, from, mergeMap, of } from 'rxjs';

/**
 * Service for managing surveys.
 */
@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private online: boolean = false;
  private surveys: FormDetail.Form[] = [];

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private storageService: StorageService
  ) { }

  /**
   * Pushes a survey to the list of surveys and saves them.
   * @param survey The survey to be pushed.
   */
  public pushSurvey(survey: FormDetail.Form): void {
    const copy = JSON.parse(JSON.stringify(survey));
    this.surveys.push(copy);
    this.saveSurveys();
  }

  /**
   * Adds a network change listener to update the online status.
   */
  public addNetworkChangeListener(): void {
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      this.online = status.connected;
      console.log('Online status is:', this.online);
    });
  }

  /**
   * Gets the current network status.
   */
  private getNetworkStatus(): void {
    Network.getStatus().then((status) => {
      console.log('Network status:', status.connected);
      this.online = status.connected;
      console.log('Online status is:', this.online);
    });
  }

  /**
   * Removes all network change listeners.
   */
  public removeAllListeners(): void {
    Network.removeAllListeners();
  }

  /**
   * Retrieves the surveys stored locally.
   */
  public getLocalSurveys(): void {
    this.storageService.get(SURVEYS_STORAGE_KEY).then((surveys) => {
      this.surveys = surveys || [];
    });
  }

  /**
   * Gets the list of surveys.
   * @returns The list of surveys.
   */
  public getSurveys(): FormDetail.Form[] {
    return this.surveys;
  }

  /**
   * Saves the surveys to the storage.
   */
  public saveSurveys(): void {
    this.storageService.set(SURVEYS_STORAGE_KEY, this.surveys);
  }

  /**
   * Syncs the surveys with the server.
   * If online, it sends the unsynced surveys to the server and updates the sync status.
   * If offline, it presents an alert.
   */
  public syncSurveys(): void {
    if (this.online) {
      const surveysToSync: FormDetail.Form[] = this.surveys.filter((survey) => !survey.sync);
      const syncRequests: Observable<FormDetail.Form | undefined>[] = surveysToSync.map((survey) => {
        return from(this.apiService.post(ENDPOINT, survey)).pipe(
          mergeMap((response) => {
            console.log(response)
            return of(response.status === 200 ? survey : undefined);
          }),
          catchError((error) => {
            console.error(error)
            return of(undefined)
          })
        );
      });

      forkJoin(syncRequests).subscribe((syncResults: (FormDetail.Form | undefined)[]) => {
        const updatedSurveys: FormDetail.Form[] = this.surveys.map((survey) => {
          const syncedSurvey = syncResults.find((syncResult) => syncResult?.id === survey.id);
          if (syncedSurvey) {
            survey.sync = true;
          }

          return survey;
        });
        console.log(updatedSurveys)
        this.surveys = updatedSurveys;
        this.saveSurveys();
      });
    } else {
      this.presentAlert();
    }
  }

  /**
   * Presents an alert when there is no internet connection.
   */
  private async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'No hay conexión a internet',
      message: 'Por favor, conéctese a internet para sincronizar las encuestas',
      buttons: ['OK'],
    });

    await alert.present();
  }

  /**
   * Changes the sync status of a survey.
   * This method is useful when a survey is synced manually.
   * The sync status is changed when the survey is synced with the server
   * so it is not used in the current implementation.
   *
   * @param survey The survey to change the sync status.
   * @param status The new sync status.
   */
  private changeSyncStatus(survey: FormDetail.Form, status: boolean): void {
    const index = this.surveys.indexOf(survey);
    this.surveys[index].sync = status; //TODO save into storage
  }
}

/**
 * Key used to store surveys in local storage.
 */
const SURVEYS_STORAGE_KEY = 'uploadSurveys';
/**
 * The endpoint for storing surveys.
 */
const ENDPOINT = SURVEYS_STORAGE_KEY;
