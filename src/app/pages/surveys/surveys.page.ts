import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormListComponent } from 'src/app/components/form-list/form-list.component';
import { SurveyService } from 'src/app/services/survey/survey.service';

@Component({
  selector: 'app-surveys',
  templateUrl: 'surveys.page.html',
  styleUrls: ['surveys.page.scss'],
  standalone: true,
  imports: [IonicModule, FormListComponent],
})
export class SurveysPage {
  constructor(private surveyService: SurveyService) {}

  getSurveys() {
    return this.surveyService.getSurveys();
  }
}
