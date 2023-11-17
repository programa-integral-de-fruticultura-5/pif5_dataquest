import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'
import { TypeComponent } from '../type.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AnswerRelationService } from '@services/detailed-form/question/answer-relation/answer-relation.service';
import { QuestionControlService } from '@services/detailed-form/control/question-control.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TypeComponent],
})
export class TableComponent {
  @Input({ required: true }) question!: any;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  constructor(
    private answerRelationService: AnswerRelationService,
    private questionControlService: QuestionControlService
  ) {}

  ngOnInit() {}

  addSection() {
    const formArray: FormArray = this.formGroup.controls[
      this.question.id
    ] as FormArray;
    let base: FormDetail.Question[] = this.question.questionChildren[0];
    const newFormGroup: FormGroup = this.questionControlService.toFormGroup(
      base
    );
    newFormGroup.reset();
    formArray.push(newFormGroup);
    this.question.questionChildren.push([...base]);
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
    return this.question.question_category.name;
  }

  getFormGroup(index: number): FormGroup {
    const formArray: FormArray = this.formGroup.controls[
      this.question.id
    ] as FormArray;
    return formArray.at(index) as FormGroup;
  }

  showQuestion(currentQuestion: FormDetail.Question, i: number) {
    const checkedAnswersRelation: boolean =
      this.answerRelationService.checkAnswerRelation(
        currentQuestion,
        this.getFormGroup(i)
      );

    checkedAnswersRelation
      ? this.enableQuestion(currentQuestion, this.getFormGroup(i))
      : this.disableQuestion(currentQuestion, this.getFormGroup(i));

    return checkedAnswersRelation;
  }

  /*   showQuestion(id: number, i: number): boolean {
    const questionId: string = id.toString();
    const enabled: boolean = this.getFormGroup(i).get(questionId)!.enabled;
    console.log('enabled: ', enabled)
    return enabled
  } */

  private enableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    this.answerRelationService.enableQuestion(question, formGroup);
  }

  private disableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    this.answerRelationService.disableQuestion(question, formGroup);
  }
}
