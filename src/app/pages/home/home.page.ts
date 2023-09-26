import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SurveyService } from 'src/app/services/survey/survey.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private surveyService: SurveyService) {}

  uploadSurveys() {
    this.surveyService.syncSurveys();
  }
}
