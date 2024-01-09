import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SurveyService } from '@services/survey/survey.service';
import { DraftService } from '@services/draft/draft.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private surveyService: SurveyService,
    private draftService: DraftService,
    private platform: Platform
  ) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.surveyService.addNetworkChangeListener();
      this.surveyService.getLocalSurveys();
      this.draftService.getLocalDrafts();
    });
  }

}
