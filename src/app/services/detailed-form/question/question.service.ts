import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../control/question-control.service';
import { AuthService } from '../../auth/auth.service';
import { AnswerRelationService } from './answer-relation/answer-relation.service';
import { Authentication } from '@models/Auth.namespace';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private filteredQuestions!: FormDetail.Question[];
  private originalQuestions!: FormDetail.Question[];
  private progress: number = 0;

  constructor(
    private questionControlService: QuestionControlService,
    private answerRelationService: AnswerRelationService,
    private authService: AuthService
  ) {}

  /*   getFilteredQuestions(): FormDetail.Question[] {
    let filteredQuestions: FormDetail.Question[] = this.originalQuestions.filter(
      (question) => question.questionParentId === null
    );
    return filteredQuestions;
  } */

  getOriginalQuestions(): FormDetail.Question[] {
    return this.originalQuestions;
  }

  async setQuestions(questions: FormDetail.Question[]): Promise<void> {
    var userType = '';
    const user: Authentication.User = await this.authService.getUser();
    userType = user.type;
    this.originalQuestions = questions;
    this.filteredQuestions = this.originalQuestions.filter(
      (question) =>
        question.userTypeRestriction === userType ||
        question.userTypeRestriction === null
    );
  }

  getOriginalLength(): number {
    return this.originalQuestions.length;
  }

  getFilteredLength(): number {
    return this.filteredQuestions.length;
  }

  getFirst(): FormDetail.Question {
    let firstQuestion: FormDetail.Question = this.filteredQuestions[0];
    return firstQuestion;
  }

  getLast(): FormDetail.Question {
    let lastIndex: number = this.filteredQuestions.length - 1;
    let lastQuestion: FormDetail.Question = this.filteredQuestions[lastIndex];
    return lastQuestion;
  }

  private getNextQuestion(
    current: FormDetail.Question
  ): FormDetail.Question | null {
    if (current !== this.getLast()) {
      let next: FormDetail.Question =
        this.filteredQuestions[this.getCurrentIndex(current) + 1];
      return next;
    }
    return null;
  }

  toggleNextQuestionFrom(
    question: FormDetail.Question,
    formGroup: FormGroup
  ): FormDetail.Question | null {
    const nextQuestion: FormDetail.Question | null =
      this.getNextQuestion(question);
    if (!nextQuestion) {
      return null;
    }
    const checkedAnswersRelation: boolean =
      this.answerRelationService.checkAnswerRelation(nextQuestion, formGroup);

    if (checkedAnswersRelation) {
      this.enableQuestion(nextQuestion, formGroup);
      this.updateProgress(nextQuestion);
      return nextQuestion;
    } else {
      this.disableQuestion(nextQuestion, formGroup);
      return this.toggleNextQuestionFrom(nextQuestion, formGroup);
    }
  }

  getCurrentIndex(current: FormDetail.Question): number {
    let currentIndex: number = this.filteredQuestions.indexOf(current);
    return currentIndex;
  }

  private getPreviousQuestion(
    current: FormDetail.Question
  ): FormDetail.Question | null {
    if (current !== this.getFirst()) {
      let previous: FormDetail.Question =
        this.filteredQuestions[this.getCurrentIndex(current) - 1];
      return previous;
    }
    return null;
  }

  getPreviousValidQuestionFrom(
    question: FormDetail.Question,
    formGroup: FormGroup
  ): FormDetail.Question | null {
    const previousQuestion: FormDetail.Question | null =
      this.getPreviousQuestion(question);
    if (!previousQuestion) {
      return null;
    }
    const id: string = previousQuestion.id.toString();
    const disabled: boolean = formGroup.get(id)!.disabled;

    if (disabled) {
      return this.getPreviousValidQuestionFrom(previousQuestion, formGroup);
    } else {
      this.updateProgress(previousQuestion);
      return previousQuestion;
    }
  }

  getProgress(): number {
    return this.progress;
  }

  updateProgress(currentQuestion: FormDetail.Question): void {
    let currentPosition: number = this.getCurrentIndex(currentQuestion) + 1;
    let length: number = this.getFilteredLength();
    let currentProgress: number = currentPosition / length;
    this.progress = currentProgress;
  }

  getFormGroup(): FormGroup {
    return this.questionControlService.toFormGroup(this.filteredQuestions);
  }

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
