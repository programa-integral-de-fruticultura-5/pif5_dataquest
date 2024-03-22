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
import _ from 'lodash';

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
    this.setQuestions();
  }

  public setQuestionsPage(questionPage: boolean): void {
    this.questionsPage = questionPage;
  }

  public isQuestionsPage(): boolean {
    return this.questionsPage;
  }

  public setBeneficiary(selectedBeneficiary: Beneficiary.Producer): boolean {
    const previousBeneficiary: Beneficiary.Producer =
      this.selectedForm.beneficiary;
    const isSpecializedForm: boolean =
      this.selectedForm.id === FormDetail.FormType.SPECIALIZED;

    if (this.selectedForm.beneficiary === selectedBeneficiary) {
      return true;
    }

    if (isSpecializedForm && previousBeneficiary) {
      previousBeneficiary.specialized = false;
    }

    const canSet: boolean | undefined =
      this.canSetBeneficiary(selectedBeneficiary);

    if (canSet) {
      this.selectedForm.beneficiary = selectedBeneficiary;
      return true;
    } else {
      return false;
    }
  }

  private canSetBeneficiary(
    selectedBeneficiary: Beneficiary.Producer
  ): boolean | undefined {
    const formId = this.selectedForm.id;

    switch (FormDetail.FormType[formId]) {
      case 'SPECIALIZED':
        return this.canSetSpecializedBeneficiary(selectedBeneficiary);
      case 'SUPPORT':
        return this.canSetSupportBeneficiary(selectedBeneficiary);
      default:
        return false;
    }
  }

  private canSetSpecializedBeneficiary(
    selectedBeneficiary: Beneficiary.Producer
  ): boolean | undefined {
    const existsProducerWithSpecializedForm: boolean =
      this.existsProducerWithSpecializedForm(selectedBeneficiary);
    const isSpecializedBeneficiary: boolean = selectedBeneficiary.specialized;

    if (!isSpecializedBeneficiary && !existsProducerWithSpecializedForm) {
      selectedBeneficiary.specialized = true;
      return true;
    } else if (isSpecializedBeneficiary || existsProducerWithSpecializedForm) {
      this.showAlreadySpecializedBeneficiaryAlert();
      return false;
    }

    return undefined;
  }

  private canSetSupportBeneficiary(
    selectedBeneficiary: Beneficiary.Producer
  ): boolean | undefined {
    const isSpecializedBeneficiary: boolean = selectedBeneficiary.specialized;
    const existsProducerWithSpecializedForm: boolean =
      this.existsProducerWithSpecializedForm(selectedBeneficiary);
    const isSupportCandidate: boolean = selectedBeneficiary.support;

    if ((isSpecializedBeneficiary || existsProducerWithSpecializedForm) && isSupportCandidate) {
      return true;
    } else if (!isSpecializedBeneficiary || !existsProducerWithSpecializedForm) {
      this.showNoSpecializedBeneficiaryAlert();
      return false;
    } else if (!isSupportCandidate) {
      this.showNoSupportBeneficiaryAlert();
      return false;
    }

    return undefined;
  }

  private async showNoSupportBeneficiaryAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Beneficiario no es candidato de asistencia técnica',
      message: 'Escoge otro beneficiario',
      buttons: ['OK'],
    });
    await alert.present();
  }

  private existsProducerWithSpecializedForm(
    producerToSearch: Beneficiary.Producer
  ): boolean {
    var exists = false;

    const drafts: FormDetail.Form[] = this.draftService.getDrafts();
    const surveys: FormDetail.Form[] = this.surveyService.getSurveys();

    const existsOnDrafts = drafts.some(
      (d) => d.beneficiary.id === producerToSearch.id && d.id === 1
    );

    const existsOnSurveys = surveys.some(
      (s) => s.beneficiary.id === producerToSearch.id && s.id === 1
    );

    exists = existsOnDrafts || existsOnSurveys;

    return exists;
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
      message:
        'Debes realizar un formulario especializado primero a este beneficiario',
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
    const copy: FormDetail.Form = _.cloneDeep(this.selectedForm);
    copy.uuid = uuidv4();
    this.draftService.pushDraft(copy);
    this.selectedForm = copy;
    this.setQuestions();
  }

  public saveSurvey(): void {
    const removedDraft: FormDetail.Form = this.draftService.removeDraft(
      this.selectedForm
    );
    const currentFormId = this.selectedForm.id;
    const currentFormBeneficiaryName = `${this.selectedForm.beneficiary.firstname}-${this.selectedForm.beneficiary.lastname}`;
    const currentFormTimestamp = this.selectedForm.fechaInicial;
    const oldPath = `borradores/${currentFormId}-${currentFormBeneficiaryName}-${currentFormTimestamp}/`;
    this.surveyService.pushSurvey(removedDraft, oldPath);
  }

  public updateModifyDate(): void {
    if (this.isDraft()) {
      this.draftService.updateModifyDate(this.selectedForm);
    }
  }
}
