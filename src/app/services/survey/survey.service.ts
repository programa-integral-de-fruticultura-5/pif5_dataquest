import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { StorageService } from '../storage/storage.service';
import { ApiService } from '../api/api.service';

const ENDPOINT = 'uploadSurveys';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private surveys: Form[];

  constructor(
    private apiService: ApiService,
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

  syncSurveys() {
    this.apiService.post(ENDPOINT, this.surveys)
  }
}
