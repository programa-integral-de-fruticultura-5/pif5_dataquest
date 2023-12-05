import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormListComponent } from '@components/form-list/form-list.component';
import { SurveyService } from '@services/survey/survey.service';

@Component({
  selector: 'app-surveys',
  templateUrl: 'surveys.page.html',
  styleUrls: ['surveys.page.scss'],
  standalone: true,
  imports: [IonicModule, FormListComponent],
})
export class SurveysPage {
  constructor(private surveyService: SurveyService) {}

  ionViewWillEnter() {
    this.surveyService.getLocalSurveys();
  }

  getSurveys() {
    return this.surveyService.getSurveys();
  }
}
