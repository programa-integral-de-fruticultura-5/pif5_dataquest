import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormDetail } from '@models/FormDetail.namespace'

@Injectable({
  providedIn: 'root',
})
export class AnswerRelationService {
  constructor() {}

  public checkAnswerRelation(
    question: FormDetail.Question,
    formGroup: FormGroup
  ): boolean {
    const answerRelation: FormDetail.AnswerRelation[] = question.answersRelation;
    var answerRelationType: string = answerRelation[0]?.answerPivot.type;
    if (answerRelationType === 'and') {
      return this.checkAndRelation(answerRelation, formGroup);
    } else if (answerRelationType === 'or') {
      return this.checkOrRelation(answerRelation, formGroup);
    } else {
      return true;
    }
  }

  private checkAndRelation(answerRelation: FormDetail.AnswerRelation[], formGroup: FormGroup): boolean {
    const everyAnswerIsSelected: boolean = answerRelation.every(
      (relation: FormDetail.AnswerRelation) => {
        return this.areSelected(relation, formGroup);
      }
    );
    return everyAnswerIsSelected;
  }

  private checkOrRelation(answerRelation: FormDetail.AnswerRelation[], formGroup: FormGroup): boolean {
    const someAnswerIsSelected: boolean = answerRelation.some(
      (relation: FormDetail.AnswerRelation) => {
        return this.areSelected(relation, formGroup);
      }
    );

    return someAnswerIsSelected;
  }

  private areSelected(relation: FormDetail.AnswerRelation, formGroup: FormGroup): boolean {
    const questionId: string = relation.questionId;
    const answerId: number = relation.answerPivot.answerId;
    const value: boolean = formGroup
      .get(questionId)!
      .get(answerId.toString())!.value;

    return value;
  }

  public disableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    const questionId: string = question.id.toString();
    formGroup.get(questionId)?.reset();
    formGroup.get(questionId)?.disable();
  }

  public enableQuestion(question: FormDetail.Question, formGroup: FormGroup): void {
    const questionId: string = question.id.toString();
    formGroup.get(questionId)?.enable();
  }
}
