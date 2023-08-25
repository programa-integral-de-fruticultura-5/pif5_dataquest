import { Injectable } from '@angular/core';
import { Question } from 'src/app/models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questions!: Question[]

  constructor() { }

  getQuestions(): Question[] {
    return this.questions;
  }

  setQuestions(questions: Question[]): void {
    this.questions = questions;
  }

  getLength(): number {
    return this.questions.length;
  }

  getFirst(): Question {
    return this.questions[0];
  }

  getLast(): Question {
    return this.questions[this.questions.length - 1];
  }

  nextQuestion(current: Question): Question {
    if (current !== this.getLast()) {
      return this.questions[this.getCurrentIndex(current) + 1];
    }
    return current;
  }

  getCurrentIndex(current: Question): number {
    return this.questions.indexOf(current);
  }

  previousQuestion(current: Question): Question {
    if (current !== this.getFirst()) {
      return this.questions[this.getCurrentIndex(current) - 1];
    }
    return current;
  }


}
