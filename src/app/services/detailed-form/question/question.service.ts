import { Injectable } from '@angular/core';
import { Question } from 'src/app/models/question';
import { AnswerService } from './answer/answer.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private filteredQuestions!: Question[]
  private originalQuestions!: Question[]
  private tableQuestions!: Question[]

  constructor(private answerService: AnswerService) { }

  getQuestions(): Question[] {
    console.log("Questions length" + this.filteredQuestions.length)
    let filteredQuestions: Question[] = this.filteredQuestions.filter(question => question.questionParentId === null);
    console.log("Filtered questions length" + filteredQuestions.length)
    return this.filteredQuestions.filter(question => question.questionParentId === null);
  }

  setQuestions(questions: Question[]): void {
    this.originalQuestions = questions;
    this.filteredQuestions = questions.filter(question => question.questionParentId === null);
  }

  setAnswers(current: Question): void {
    this.answerService.setAnswers(current.answers);
  }

  getLength(): number {
    return this.originalQuestions.length;
  }

  getFirst(): Question {
    this.setAnswers(this.filteredQuestions[0]);
    return this.filteredQuestions[0];
  }

  getLast(): Question {
    return this.filteredQuestions[this.filteredQuestions.length - 1];
  }

  nextQuestion(current: Question): Question {
    if (current !== this.getLast()) {
      let next: Question = this.filteredQuestions[this.getCurrentIndex(current) + 1]
      this.setAnswers(next)
      return next;
    }
    return current;
  }

  getCurrentIndex(current: Question): number {
    return this.filteredQuestions.indexOf(current);
  }

  previousQuestion(current: Question): Question {
    if (current !== this.getFirst()) {
      let previous: Question = this.filteredQuestions[this.getCurrentIndex(current) - 1]
      this.setAnswers(previous)
      return previous
    }
    return current;
  }

  getTableQuestions(current: Question): Question[] {
    let tableQuestions: Question[] = this.originalQuestions.filter(question => question.questionParentId === current.id)
    return tableQuestions;
  }

}
