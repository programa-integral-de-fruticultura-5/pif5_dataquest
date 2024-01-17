import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace';
import { TypeComponent } from '../type.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AnswerRelationService } from '@services/detailed-form/question/answer-relation/answer-relation.service';
import { QuestionControlService } from '@services/detailed-form/control/question-control.service';
import { RxFor } from '@rx-angular/template/for';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { Beneficiary } from '@models/Beneficiary.namespace';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TypeComponent, RxFor],
})
export class TableComponent {
  @Input({ required: true }) question!: any;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  constructor(
    private answerRelationService: AnswerRelationService,
    private questionControlService: QuestionControlService,
    private detailedFormService: DetailedFormService
  ) {}

  ngOnInit() {
    if (this.question.order === 5) {
      this.disabled = true;
      this.preloadSelectedAnswers();
    }
  }

  private preloadSelectedAnswers() {
    const selectedAnswers: Beneficiary.SelectedQuestions =
      this.detailedFormService.getForm().beneficiary.recommendedActions;
    const formArray: FormArray = this.formGroup.controls[
      this.question.id
    ] as FormArray;
    const sectionFormGroup: FormGroup = formArray.at(0) as FormGroup;
    console.log('selectedAnswers', selectedAnswers);
    Object.keys(sectionFormGroup.controls).forEach((key) => {
      const answersFormGroup: FormGroup = sectionFormGroup.get(
        key
      ) as FormGroup;
      const answersControls: string[] = Object.keys(answersFormGroup.controls);
      const answerFormGroupKey: string = selectedAnswers[key]
        ? answersControls[0]
        : answersControls[1];
      answersFormGroup.get(answerFormGroupKey)?.setValue(true);
      console.log('selectedAnswer', selectedAnswers[key]);
    });
  }

  addSection() {
    const formArray: FormArray = this.formGroup.controls[
      this.question.id
    ] as FormArray;
    let baseArrayCopy: FormDetail.Question[] = JSON.parse(
      JSON.stringify(this.question.questionChildren[0])
    );
    this.changeQuestionId(baseArrayCopy);
    const newFormGroup: FormGroup =
      this.questionControlService.toFormGroup(baseArrayCopy);
    newFormGroup.reset();
    formArray.push(newFormGroup);
    this.question.questionChildren.push(baseArrayCopy);
  }

  private changeQuestionId(base: FormDetail.Question[]) {
    base.forEach((question) => {
      const newId: string = `${this.question.questionChildren.length}-${question.id}`;
      base.forEach((q) => {
        q.answersRelation.forEach((ar) => {
          if (ar.questionId === question.id) {
            ar.questionId = newId;
          }
        });
      });
      question.id = newId;
    });
  }

  removeSection() {
    if (this.question.questionChildren.length > 1) {
      const formArray: FormArray = this.formGroup.controls[
        this.question.id
      ] as FormArray;
      formArray.removeAt(formArray.length - 1);
      this.question.questionChildren.pop();
    }
  }

  getQuestionChildren(): FormDetail.Question[][] {
    return this.question.questionChildren;
  }

  getText(): string {
    return this.question.text;
  }

  getOrder(): number {
    return this.question.order;
  }

  getCategory(): string {
    return this.question.questionCategory.name;
  }

  getFormGroup(index: number): FormGroup {
    const formArray: FormArray = this.formGroup.controls[
      this.question.id
    ] as FormArray;
    return formArray.at(index) as FormGroup;
  }

  getChildQuestion(
    sectionIndex: number,
    childIndex: number
  ): FormDetail.Question {
    const questionChildren: FormDetail.Question[][] =
      this.question.questionChildren;
    return questionChildren[sectionIndex][childIndex];
  }

  showQuestion(childIndex: number, sectionIndex: number) {
    const childQuestion: FormDetail.Question = this.getChildQuestion(
      sectionIndex,
      childIndex
    );
    const sectionFormGroup: FormGroup = this.getFormGroup(sectionIndex);
    let checkedAnswersRelation: boolean = false;
    if (childQuestion) {
      checkedAnswersRelation = this.answerRelationService.checkAnswerRelation(
        childQuestion,
        sectionFormGroup
      );

      checkedAnswersRelation
        ? this.enableQuestion(childQuestion, sectionFormGroup)
        : this.disableQuestion(childQuestion, sectionFormGroup);
    }

    return checkedAnswersRelation;
  }

  /*   showQuestion(id: number, i: number): boolean {
    const questionId: string = id.toString();
    const enabled: boolean = this.getFormGroup(i).get(questionId)!.enabled;
    console.log('enabled: ', enabled)
    return enabled
  } */

  private enableQuestion(
    question: FormDetail.Question,
    formGroup: FormGroup
  ): void {
    this.answerRelationService.enableQuestion(question, formGroup);
  }

  private disableQuestion(
    question: FormDetail.Question,
    formGroup: FormGroup
  ): void {
    this.answerRelationService.disableQuestion(question, formGroup);
  }
}
