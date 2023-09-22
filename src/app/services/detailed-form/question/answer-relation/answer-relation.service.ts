import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AnswerRelation } from 'src/app/models/answerRelation';
import { Question } from 'src/app/models/question';

@Injectable({
  providedIn: 'root',
})
export class AnswerRelationService {
  constructor() {}

  public checkAnswerRelation(
    question: Question,
    formGroup: FormGroup
  ): boolean {
    const answerRelation: AnswerRelation[] = question.answers_relation;
    var answerRelationType: string = answerRelation[0]?.pivot.type;
    if (answerRelationType === 'and') {
      return this.checkAndRelation(answerRelation, formGroup);
    } else if (answerRelationType === 'or') {
      return this.checkOrRelation(answerRelation, formGroup);
    } else {
      return true;
    }
  }

  private checkAndRelation(answerRelation: any, formGroup: FormGroup): boolean {
    const everyAnswerIsSelected: boolean = answerRelation.every(
      (relation: any) => {
        return this.areSelected(relation, formGroup);
      }
    );
    return everyAnswerIsSelected;
  }

  private checkOrRelation(answerRelation: any, formGroup: FormGroup): boolean {
    const someAnswerIsSelected: boolean = answerRelation.some(
      (relation: any) => {
        return this.areSelected(relation, formGroup);
      }
    );

    return someAnswerIsSelected;
  }

  private areSelected(relation: any, formGroup: FormGroup): boolean {
    const questionId: number = relation.question_id;
    const answerId: number = relation.pivot.answer_id;

    const value: boolean = formGroup
      .get(questionId.toString())!
      .get(answerId.toString())!.value;

    return value;
  }

  public disableQuestion(question: Question, formGroup: FormGroup): void {
    const questionId: string = question.id.toString();
    formGroup.get(questionId)?.reset();
    formGroup.get(questionId)?.disable();
  }

  public enableQuestion(question: Question, formGroup: FormGroup): void {
    const questionId: string = question.id.toString();
    formGroup.get(questionId)?.enable();
  }
}
