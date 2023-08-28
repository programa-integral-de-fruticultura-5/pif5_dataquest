import { Injectable } from '@angular/core';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';
import { AnswerService } from './answer/answer.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questions!: Question[]

  constructor(private answerService: AnswerService) { }

  getQuestions(): Question[] {
    return this.questions;
  }

  setQuestions(questions: Question[]): void {
    this.questions = questions;
  }

  setAnswers(current: Question): void {
    this.answerService.setAnswers(current.answers);
  }

  getLength(): number {
    return this.questions.length;
  }

  getFirst(): Question {
    this.setAnswers(this.questions[0]);
    return this.questions[0];
  }

  getLast(): Question {
    return this.questions[this.questions.length - 1];
  }

  nextQuestion(current: Question): Question {
    if (current !== this.getLast()) {
      let next: Question = this.questions[this.getCurrentIndex(current) + 1]
      this.setAnswers(next)
      return next;
    }
    return current;
  }

  getCurrentIndex(current: Question): number {
    return this.questions.indexOf(current);
  }

  previousQuestion(current: Question): Question {
    if (current !== this.getFirst()) {
      let previous: Question = this.questions[this.getCurrentIndex(current) - 1]
      this.setAnswers(previous)
      return previous
    }
    return current;
  }


}
