import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormListComponent } from '@components/form-list/form-list.component';
import { SurveyService } from '@services/survey/survey.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-surveys',
  templateUrl: 'surveys.page.html',
  styleUrls: ['surveys.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule ],
})
export class SurveysPage {

  constructor(
    private surveyService: SurveyService,
    private detailedFormService: DetailedFormService,
    private router: Router
  ) {}

  ionViewWillEnter() { }

  private getSurveys(): FormDetail.Form[] {
    return this.surveyService.getSurveys();
  }

  getSyncedSurveys(): FormDetail.Form[] {
    const surveys: FormDetail.Form[] = this.getSurveys();
    return surveys.filter((survey) => survey.sync);
  }

  getUnsyncedSurveys(): FormDetail.Form[] {
    const surveys: FormDetail.Form[] = this.getSurveys();
    return surveys.filter((survey) => !survey.sync);
  }

  goToDetail(survey: FormDetail.Form): void {
    this.detailedFormService.setForm(survey, false, false, true);
    this.router.navigate(['detail']);
  }

  getSyncedRatio(): string {
    const surveys: FormDetail.Form[] = this.getSurveys();
    const syncedSurveys: FormDetail.Form[] = this.getSyncedSurveys();
    return `${syncedSurveys.length} / ${surveys.length}`;
  }

  getUnsyncedRatio(): string {
    const surveys: FormDetail.Form[] = this.getSurveys();
    const unsyncedSurveys: FormDetail.Form[] = this.getUnsyncedSurveys();
    return `${unsyncedSurveys.length} / ${surveys.length}`;
  }
}
