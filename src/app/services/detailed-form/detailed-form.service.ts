import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { FormService } from '../form/form.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { QuestionService } from './question/question.service';
import { DraftService } from '../draft/draft.service';
import { SurveyService } from '../survey/survey.service';

@Injectable({
  providedIn: 'root'
})
export class DetailedFormService {

  private selectedForm!: Form;

  constructor(
    private formService: FormService,
    private draftService: DraftService,
    private surveyService: SurveyService,
    private questionService: QuestionService
  ) { }

  public getForm(): Form {
    return this.selectedForm;
  }

  public setForm(form: Form): void {
    this.selectedForm = form;
    this.setQuestions();
  }

  public setQuestions(): void {
    this.questionService.setQuestions(this.selectedForm.questions);
  }

  public getLocation(): void {
    Geolocation.getCurrentPosition().then((position) => {
      this.selectedForm.position = position.coords.latitude + ',' + position.coords.longitude;
    }).catch((err) => {
      throw err;
    })
  }

  public getTotalQuestions(): number {
    return this.selectedForm.questions.length;
  }

  public startDraft(): void {
    this.draftService.pushDraft(this.selectedForm);
    this.formService.save()
  }

  public saveSurvey(): void {
    const removedDraft: Form = this.draftService.removeDraft(this.selectedForm);
    this.surveyService.pushSurvey(removedDraft);
    this.draftService.saveDrafts();
    this.surveyService.saveSurveys();
  }
}
