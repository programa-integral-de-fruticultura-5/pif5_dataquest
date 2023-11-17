import { Component } from '@angular/core';
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { QuestionService } from '@services/detailed-form/question/question.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from './type/table/table.component';
import { TypeComponent } from './type/type.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AnswerRelationService } from '@services/detailed-form/question/answer-relation/answer-relation.service';
import { DraftService } from '@services/draft/draft.service';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TypeComponent,
    TableComponent,
    DataquestHeaderComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class QuestionComponent {
  currentQuestion!: FormDetail.Question;
  formGroup!: FormGroup;
  disabled: boolean = false;
  alertShown: boolean = false;

  constructor(
    private draftService: DraftService,
    private detailedFormService: DetailedFormService,
    private questionService: QuestionService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private answerRelationService: AnswerRelationService,
    private platform: Platform,
    private router: Router
  ) {}

  async ngOnInit() {
    this.formGroup = this.questionService.getFormGroup();
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
    this.currentQuestion = this.getLastAnsweredQuestion();
    loading.dismiss();
    if (this.isSurvey()) {
      this.disabled = true;
    }
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.confirmExit();
    });
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'Si sale, su progreso se guardará como borrador.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salir',
          role: 'confirm',
          cssClass: 'danger',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
    });

    await alert.present();
  }

  ionViewWillLeave() {
    this.confirmExit();
  }

  async nextQuestion() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
    if (this.isQuestionValid()) {
      this.saveResponse(this.currentQuestion, this.formGroup);
      this.draftService.saveDrafts();
      const nextQuestion = this.getNextQuestionFrom(this.currentQuestion);
      if (nextQuestion) {
        this.currentQuestion = nextQuestion;
        if (
          this.currentQuestion.questionCategory.name ===
          'Capital social individual' && !this.alertShown
        ) {
          this.alertShown = true;
          this.alertController
            .create({
              header: 'Atención',
              subHeader: 'Capital social individual',
              message:
                'A continuación, pasamos a las preguntas que corresponden al componente del capital social individual del índice de desarrollo socio-organizacional.',
              buttons: ['OK'],
            })
            .then((alert) => alert.present());
        }
      }
    } else {
      const type: string = this.currentQuestion.type;
      const isTable: boolean = type === 'Tabla';
      this.presentAlert(isTable);
    }
    await loading.dismiss();
  }

  private getLastAnsweredQuestion(): FormDetail.Question {
    let lastAnsweredQuestion: FormDetail.Question = this.questionService.getFirst();
    const formGroup: FormGroup = this.formGroup;
    while (formGroup.controls[lastAnsweredQuestion.id.toString()].valid) {
      lastAnsweredQuestion = this.getNextQuestionFrom(lastAnsweredQuestion)!;
    }
    return lastAnsweredQuestion;
  }

  previousQuestion(): void {
    const previousQuestion = this.getPreviousQuestionFrom(this.currentQuestion);
    if (previousQuestion) {
      this.currentQuestion = previousQuestion;
    }
  }

  async presentAlert(isTable: boolean) {
    const tableMessage: string =
      'Por favor, responda todas las preguntas de las secciones para continuar.';
    const genericMessage: string =
      'Por favor, responda la pregunta para continuar.';
    const alert = await this.alertController.create({
      header: 'Pregunta requerida',
      message: isTable ? tableMessage : genericMessage,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onSubmit() {
    if (this.isValid()) {
      this.saveResponse(this.currentQuestion, this.formGroup);
      this.detailedFormService.saveSurvey();
      this.navCtrl.pop();
    } else {
      this.presentAlert(false);
    }
  }

  getCategory(): string {
    return this.currentQuestion?.questionCategory.name;
  }

  getType(): string {
      return this.currentQuestion?.type;
  }

  private isQuestionValid() {
    return this.formGroup.controls[this.currentQuestion.id].valid;
  }

  private isValid() {
    return this.formGroup.valid;
  }

  isLastQuestion(): boolean {
    let question: FormDetail.Question = this.currentQuestion;
    const nextQuestion: FormDetail.Question | null = this.getNextQuestionFrom(question);
    if (!nextQuestion) {
      return true;
    }

    return this.formGroup.controls[nextQuestion.id]!.disabled;
  }

  isFirstQuestion(): boolean {
    let question: FormDetail.Question = this.currentQuestion;
    let firstQuestion: FormDetail.Question = this.questionService.getFirst();
    return question?.id === firstQuestion.id;
  }

  private saveResponse(question: FormDetail.Question, formGroup: FormGroup): void {
    switch (question.type) {
      case 'Abierta':
        this.saveOpenResponse(question, formGroup);
        break;
      case 'Tabla':
        this.saveTableResponse(question, formGroup);
        break;
      default:
        const questionFormGroup: FormGroup = formGroup.controls[
          question.id
        ] as FormGroup;
        this.saveSelection(question, questionFormGroup);
    }
    this.detailedFormService.updateModifyDate();
  }

  private saveTableResponse(question: FormDetail.Question, formGroup: FormGroup) {
    let questionFormArray: FormArray = formGroup.controls[
      question.id
    ] as FormArray;
    this.currentQuestion.questionChildren.forEach((section, index) => {
      let sectionFormGroup: FormGroup = questionFormArray.at(
        index
      ) as FormGroup;
      section.forEach((child) => {
        this.saveResponse(child, sectionFormGroup);
      });
    });
  }

  private saveSelection(question: FormDetail.Question, answersFormGroup: FormGroup) {
    question.answers.forEach((answer) => {
      const value: boolean =
        answersFormGroup.controls[answer.id.toString()].value;
      answer.checked = value;
    });
    if (
      question.type === 'Múltiple respuesta con otro' ||
      question.type === 'Única respuesta con otro'
    ) {
      const textAnswered: string = answersFormGroup.controls['other'].value;
      const fullSavedString: string =
        question.answers[question.answers.length - 1].value;
      const savedStringArray: string[] = fullSavedString.split(':');

      if (savedStringArray.length === 2) {
        savedStringArray[1] = textAnswered;
      } else {
        savedStringArray.push(textAnswered);
      }
      question.answers[question.answers.length - 1].value =
        savedStringArray.join(':');
    }
  }

  private saveOpenResponse(question: FormDetail.Question, formGroup: FormGroup) {
    if (question.dataType === 'tel') {
      let answersGroup: FormGroup = formGroup.controls[
        question.id
      ] as FormGroup;
      question.answers.forEach((answer) => {
        const value: string = answersGroup.controls[answer.order].value;
        answer.value = value;
      });
    } else {
      let formResponse = formGroup.controls[question.id].value;
      let answer = question.answers[0];
      answer.value = formResponse;
    }
  }

  private getNextQuestionFrom(question: FormDetail.Question): FormDetail.Question | null {
    const nextQuestion: FormDetail.Question | null =
      this.questionService.nextQuestion(question);
    const formGroup: FormGroup = this.formGroup;
    if (!nextQuestion) {
      return null;
    }
    const checkedAnswersRelation: boolean =
      this.answerRelationService.checkAnswerRelation(nextQuestion, formGroup);

    if (checkedAnswersRelation) {
      this.enableQuestion(nextQuestion, formGroup);
      return nextQuestion;
    } else {
      this.disableQuestion(nextQuestion, formGroup);
      return this.getNextQuestionFrom(nextQuestion);
    }
  }

  private getPreviousQuestionFrom(question: FormDetail.Question): FormDetail.Question | null {
    const previousQuestion: FormDetail.Question | null =
      this.questionService.previousQuestion(question);
    if (!previousQuestion) {
      return null;
    }
    const id: string = previousQuestion.id.toString();
    const disabled: boolean = this.formGroup.get(id)!.disabled;

    if (disabled) {
      return this.getPreviousQuestionFrom(previousQuestion);
    } else {
      return previousQuestion;
    }
  }

  private enableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    this.answerRelationService.enableQuestion(question, formGroup);
  }

  private disableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    this.answerRelationService.disableQuestion(question, formGroup);
  }

  isDraft(): boolean {
    return this.detailedFormService.isDraft();
  }

  isSurvey(): boolean {
    return this.detailedFormService.isSurvey();
  }
}
