import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { FormService } from '../form/form.service';
import { Geolocation } from '@capacitor/geolocation';
import { v4 as uuidv4 } from 'uuid';
import { QuestionService } from './question/question.service';
import { DraftService } from '../draft/draft.service';
import { SurveyService } from '../survey/survey.service';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class DetailedFormService {
  private selectedForm!: FormDetail.Form;
  private form!: boolean;
  private draft!: boolean;
  private survey!: boolean;
  private questionsPage!: boolean;

  constructor(
    private formService: FormService,
    private draftService: DraftService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private alertController: AlertController
  ) {}

  public getForm(): FormDetail.Form {
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

  public setForm(
    form: FormDetail.Form,
    formType: boolean,
    draftType: boolean,
    surveyType: boolean
  ): void {
    this.selectedForm = form;
    this.form = formType;
    this.draft = draftType;
    this.survey = surveyType;
    if (this.isDraft() || this.isSurvey()) {
      this.setQuestions();
    }
  }

  public setQuestionsPage(questionPage: boolean): void {
    this.questionsPage = questionPage;
  }

  public isQuestionsPage(): boolean {
    return this.questionsPage;
  }

  public setBeneficiary(selectedBeneficiary: Beneficiary.Producer): boolean {
    const previousBeneficiary: Beneficiary.Producer = this.selectedForm.beneficiary;
    const isSpecializedForm: boolean = this.selectedForm.id === 1;
    if (isSpecializedForm && previousBeneficiary) {
      previousBeneficiary.specialized = false;
    }
    if (this.selectedForm.beneficiary === selectedBeneficiary) {
      return true;
    }

    const canSet =
      (isSpecializedForm && !selectedBeneficiary.specialized) ||
      (!isSpecializedForm && selectedBeneficiary.specialized);

    if (canSet) {
      if (this.selectedForm.id === 1) {
        selectedBeneficiary.specialized = true;
      }
      this.selectedForm.beneficiary = selectedBeneficiary;
      return true;
    } else if (this.selectedForm.id === 1) {
      this.showAlreadySpecializedBeneficiaryAlert();
      return false;
    } else {
      this.showNoSpecializedBeneficiaryAlert();
      return false;
    }
  }

  private async showAlreadySpecializedBeneficiaryAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Beneficiario ya tiene formulario especializado',
      message: 'Elimina el formulario respectivo o escoge otro beneficiario',
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showNoSpecializedBeneficiaryAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sin formulario especializado',
      message: 'Debes realizar un formulario especializado primero a este beneficiario',
      buttons: ['OK'],
    });
    await alert.present();
  }

  public setQuestions(): void {
    this.questionService.setQuestions(this.selectedForm.questions);
  }

  public getLocation(): void {
    Geolocation.getCurrentPosition()
      .then((position) => {
        this.selectedForm.position =
          position.coords.latitude + ',' + position.coords.longitude;
      })
      .catch((err) => {
        throw err;
      });
  }

  public getTotalQuestions(): number {
    return this.selectedForm.questions.length;
  }

  public startDraft(): void {
    const copy: FormDetail.Form = JSON.parse(JSON.stringify(this.selectedForm));
    this.selectedForm = copy;
    this.selectedForm.uuid = uuidv4();
    this.draftService.pushDraft(this.selectedForm);
    this.setQuestions();
  }

  public saveSurvey(): void {
    const removedDraft: FormDetail.Form = this.draftService.removeDraft(
      this.selectedForm
    );
    this.surveyService.pushSurvey(removedDraft);
    this.draftService.saveDrafts();
  }

  public updateModifyDate(): void {
    if (this.isDraft()) {
      this.draftService.updateModifyDate(this.selectedForm);
    }
  }
}
