import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace'
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../control/question-control.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private filteredQuestions!: FormDetail.Question[];
  private originalQuestions!: FormDetail.Question[];
  private progress: number = 0;

  constructor(
    private questionControlService: QuestionControlService,
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

  setQuestions(questions: FormDetail.Question[]): void {
    this.originalQuestions = questions;
    this.filteredQuestions = this.originalQuestions.filter(
      (question) => question.questionParentId === null
    );
    this.filteredQuestions = this.filteredQuestions.filter(
      async (question) =>
        question.userTypeRestriction === (await this.authService.getUser()).type ||
        question.userTypeRestriction === null
    );
    console.log(this.filteredQuestions);
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

  nextQuestion(current: FormDetail.Question): FormDetail.Question | null {
    if (current !== this.getLast()) {
      let next: FormDetail.Question =
        this.filteredQuestions[this.getCurrentIndex(current) + 1];
      this.updateProgress(next);
      return next;
    }
    return null;
  }

  getCurrentIndex(current: FormDetail.Question): number {
    let currentIndex: number = this.filteredQuestions.indexOf(current);
    return currentIndex;
  }

  previousQuestion(current: FormDetail.Question): FormDetail.Question | null {
    if (current !== this.getFirst()) {
      let previous: FormDetail.Question =
        this.filteredQuestions[this.getCurrentIndex(current) - 1];
      this.updateProgress(previous);
      return previous;
    }
    return null;
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
}
