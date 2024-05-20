import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';
import { Network } from '@capacitor/network';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'environment';
import mockForm from '../../../data/mock-form';
import { FilesystemService } from '@services/filesystem/filesystem.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing surveys.
 */
@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private online: boolean = false;
  private surveys: FormDetail.Form[] = [];
  private uuidArray: string[] = [];
  public counter: number = 0;
  public isSyncing: boolean = false;

  constructor(
    private apiService: ApiService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storageService: StorageService,
    private filesystemService: FilesystemService
  ) {}

  /**
   * Pushes a survey to the list of surveys and saves them.
   * @param survey The survey to be pushed.
   */
  public pushSurvey(survey: FormDetail.Form, oldPath: string): void {
    const copy = JSON.parse(JSON.stringify(survey));
    this.surveys.push(copy);
    this.saveSurveyInStorage(copy, oldPath);
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
  public getNetworkStatus(): void {
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
    this.getUUIDArrayFromLocalStorage();
    // this.createSurveysFolder();
    this.storageService.get(SURVEYS_STORAGE_KEY).then((surveys) => {
      this.surveys = surveys || this.getSurveysArrayFromStorage() || [];
      /* if (!environment.production && this.surveys.length === 0)
        this.createMockSurveys(); */
    });
    // this.saveSurveys();
  }

  /**
   * Retrieves the surveys stored locally.
   * @returns The list of surveys stored locally.
   */
  public getSurveysArrayFromStorage(): FormDetail.Form[] {
    var surveys: FormDetail.Form[] = [];
    for (let i = 0; i < this.uuidArray.length; i++) {
      this.storageService
        .get(`${SURVEY_STORAGE_KEY}-${this.uuidArray[i]}`)
        .then((survey) => {
          if (survey) surveys.push(survey);
        });
    }
    return surveys;
  }

  /**
   * Retrieves the list of UUIDs from local storage.
   */
  private getUUIDArrayFromLocalStorage(): void {
    this.storageService.get(UUID_ARRAY_STORAGE_KEY).then((uuidArray) => {
      this.uuidArray = uuidArray || [];
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
  private saveSurveys(): void {
    for (let i = 0; i < this.surveys.length; i++) {
      this.saveSurveyInStorage(this.surveys[i]);
    }
    this.storageService.remove(SURVEYS_STORAGE_KEY);
  }

  /**
   * Saves a survey to the storage.
   */
  private saveSurveyInStorage(survey: FormDetail.Form, oldPath?: string): void {
    this.storageService.set(`${SURVEY_STORAGE_KEY}-${survey.uuid}`, survey);
    if (!this.uuidArray.includes(survey.uuid)) {
      this.uuidArray.push(survey.uuid);
      this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
    }
    this.saveSurveyInFile(survey, oldPath);
  }

  public async syncSurveys(): Promise<void> {
    this.counter = 0;
    this.isSyncing = true;
    if (this.online) {
      const surveysToSync: FormDetail.Form[] = this.surveys.filter(
        (survey) => !survey.sync
      );

      // Iterate over the surveysToSync with a delay
      const syncResults: (FormDetail.Form | undefined)[] = [];
      for (const survey of surveysToSync) {
        this.counter += 1;
        try {
          const response = await this.apiService
            .post(ENDPOINT, survey);
          if (response.status === 200) {
            syncResults.push(survey);
          } else {
            syncResults.push(undefined);
          }
        } catch (error) {
          syncResults.push(undefined);
        }
        // Add delay of 5000 ms after each request
        await this.delay(5000);
      }

      const updatedSurveys: FormDetail.Form[] = this.surveys.map((survey) => {
        const syncedSurvey = syncResults.find(
          (syncResult) => syncResult?.uuid === survey.uuid
        );
        if (syncedSurvey) {
          survey.sync = true;
        }

        return survey;
      });

      this.surveys = updatedSurveys;
      this.saveSurveys();
      this.isSyncing = false;
    } else {
      this.presentAlert();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  /**
   * Creates the surveys folder in the device.
   * @returns A promise that resolves when the folder is created.
   */
  private async createSurveysFolder(): Promise<void> {
    const path = 'encuestas';
    this.filesystemService.createFolder(path);
  }

  /**
   * Saves a survey to a file.
   * @param survey The survey to be saved.
   * @returns A promise that resolves when the survey is saved.
   */
  private async saveSurveyInFile(
    survey: FormDetail.Form,
    oldPath?: string
  ): Promise<void> {
    const surveyId = survey.id;
    const surveyBeneficiaryName = `${survey.beneficiary.firstname}-${survey.beneficiary.lastname}`;
    const timestamp = survey.fechaInicial;
    const path = `encuestas/${surveyId}-${surveyBeneficiaryName}-${timestamp}`;
    if (oldPath) await this.filesystemService.copy(oldPath, path);
    else
      this.filesystemService.writeFile(
        `${path}/${surveyId}-${surveyBeneficiaryName}-${timestamp}.txt`,
        JSON.stringify(survey)
      );
  }

  // private createMockSurveys(): void {
  //   const mockSurveys: FormDetail.Form[] = [];
  //   for (let i = 0; i < 20; i++) {
  //     const uuid = uuidv4();
  //     mockForm.uuid = uuid;
  //     mockSurveys.push(JSON.parse(JSON.stringify(mockForm)));
  //   }
  //   this.surveys.push(...mockSurveys);
  //   this.saveSurveys();
  // }
}

/**
 * Key used to store surveys in local storage.
 */
const SURVEYS_STORAGE_KEY = 'uploadSurveys';
/**
 * Key used to store individual surveys in local storage.
 */
const SURVEY_STORAGE_KEY = 'survey-storage';
/**
 * Key used to store the size of the surveys in local storage.
 */
const UUID_ARRAY_STORAGE_KEY = 'surveys-uuid-array';
/**
 * The endpoint for storing surveys.
 */
const ENDPOINT = SURVEYS_STORAGE_KEY;
