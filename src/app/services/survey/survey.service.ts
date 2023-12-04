import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Network } from '@capacitor/network';
import { AlertController } from '@ionic/angular';
import { Observable, catchError, forkJoin, from, mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private online!: boolean;
  private surveys!: FormDetail.Form[];

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private storageService: StorageService
  ) {
    this.listenToNetworkStatus();
    this.getLocalSurveys();
  }

  public pushSurvey(survey: FormDetail.Form): void {
    const copy = { ...survey };
    this.surveys.push(copy);
    this.saveSurveys();
  }

  private listenToNetworkStatus(): void {
    Network.addListener('networkStatusChange', (status) => {
      this.online = status.connected;
    });
  }

  public getLocalSurveys(): void {
    this.storageService.get(SURVEYS_STORAGE_KEY).then((surveys) => {
      this.surveys = surveys || [];
    });
  }

  public getSurveys(): FormDetail.Form[] {
    return this.surveys;
  }

  public saveSurveys(): void {
    this.storageService.set(SURVEYS_STORAGE_KEY, this.surveys);
  }

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
    }
  }

  private changeSyncStatus(survey: FormDetail.Form, status: boolean): void {
    const index = this.surveys.indexOf(survey);
    this.surveys[index].sync = status; //TODO save into storage
  }
}

const SURVEYS_STORAGE_KEY = 'uploadSurveys';
const ENDPOINT = SURVEYS_STORAGE_KEY;
