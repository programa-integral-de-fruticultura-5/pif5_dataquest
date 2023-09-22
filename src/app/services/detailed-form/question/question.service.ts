import { Injectable } from '@angular/core';
import { Question } from 'src/app/models/question';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../control/question-control.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private filteredQuestions!: Question[];
  private originalQuestions!: Question[];
  private progress: number = 0;

  constructor(
    private questionControlService: QuestionControlService
  ) {}

  getFilteredQuestions(): Question[] {
    let filteredQuestions: Question[] = this.filteredQuestions.filter(
      (question) => question.questionParentId === null
    );
    return filteredQuestions;
  }

  getOriginalQuestions(): Question[] {
    return this.originalQuestions;
  }

  setQuestions(questions: Question[]): void {
    this.originalQuestions = questions;
    this.filteredQuestions = questions.filter(
      (question) => question.questionParentId === null
    );
  }

  getOriginalLength(): number {
    return this.originalQuestions.length;
  }

  getFilteredLength(): number {
    return this.filteredQuestions.length;
  }

  getFirst(): Question {
    let firstQuestion: Question = this.filteredQuestions[0];
    return firstQuestion;
  }

  getLast(): Question {
    let lastIndex: number = this.filteredQuestions.length - 1;
    let lastQuestion: Question = this.filteredQuestions[lastIndex];
    return lastQuestion;
  }

  nextQuestion(current: Question): Question {
    if (current !== this.getLast()) {
      let next: Question =
        this.filteredQuestions[this.getCurrentIndex(current) + 1];
      this.updateProgress(next);
      return next;
    }
    return current;
  }

  getCurrentIndex(current: Question): number {
    let currentIndex: number = this.filteredQuestions.indexOf(current);
    return currentIndex;
  }

  previousQuestion(current: Question): Question {
    if (current !== this.getFirst()) {
      let previous: Question =
        this.filteredQuestions[this.getCurrentIndex(current) - 1];
      this.updateProgress(previous);
      return previous;
    }
    return current;
  }

  getProgress(): number {
    return this.progress;
  }

  updateProgress(currentQuestion: Question): void {
    let currentPosition: number = this.getCurrentIndex(currentQuestion) + 1;
    let length: number = this.getFilteredLength();
    let currentProgress: number = currentPosition / length;
    this.progress = currentProgress;
  }

  getFormGroup(): FormGroup {
    return this.questionControlService.toFormGroup(this.originalQuestions);
  }
}
