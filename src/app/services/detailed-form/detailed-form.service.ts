import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { FormService } from '../form/form.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { v4 as uuidv4 } from 'uuid';
import { QuestionService } from './question/question.service';
import { DraftService } from '../draft/draft.service';
import { SurveyService } from '../survey/survey.service';
import { Producer } from 'src/app/models/beneficiary/producer';

@Injectable({
  providedIn: 'root'
})
export class DetailedFormService {

  private selectedForm!: Form;
  private form!: boolean;
  private draft!: boolean;
  private survey!: boolean;

  constructor(
    private formService: FormService,
    private draftService: DraftService,
    private surveyService: SurveyService,
    private questionService: QuestionService
  ) { }

  public getForm(): Form {
    return this.selectedForm;
  }

  public isForm(): boolean {
    return this.form;
  }

  public isDraft(): boolean {
    return this.draft;
  }

  public isSurvey(): boolean {
    return this.survey;
  }

  public setForm(form: Form, formType: boolean, draftType: boolean, surveyType: boolean): void {
    this.selectedForm = form;
    this.form = formType;
    this.draft = draftType;
    this.survey = surveyType;
    this.setQuestions();
  }

  public setBeneficiary (selectedBeneficiary: Producer): void {
    this.selectedForm.beneficiary = selectedBeneficiary;
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
    const copy: Form = JSON.parse(JSON.stringify(this.selectedForm));
    copy.uuid = uuidv4();
    this.draftService.pushDraft(copy);
  }

  public saveSurvey(): void {
    const removedDraft: Form = this.draftService.removeDraft(this.selectedForm);
    this.surveyService.pushSurvey(removedDraft);
    this.draftService.saveDrafts();
    this.surveyService.saveSurveys();
  }
}
