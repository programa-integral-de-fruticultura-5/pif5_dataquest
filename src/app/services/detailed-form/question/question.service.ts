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
  private progress: number = 0;

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

  getOriginalLength(): number {
    return this.originalQuestions.length;
  }

  getFilteredLength(): number {
    return this.filteredQuestions.length;
  }

  getFirst(): Question {
    let firstQuestion: Question = this.filteredQuestions[0];
    this.setAnswers(firstQuestion);
    return firstQuestion;
  }

  getLast(): Question {
    let lastIndex: number = this.filteredQuestions.length - 1;
    let lastQuestion: Question = this.filteredQuestions[lastIndex];
    this.setAnswers(lastQuestion);
    return lastQuestion;
  }

  nextQuestion(current: Question): Question {
    if (current !== this.getLast()) {
      let next: Question = this.filteredQuestions[this.getCurrentIndex(current) + 1]
      this.setAnswers(next)
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
      let previous: Question = this.filteredQuestions[this.getCurrentIndex(current) - 1]
      this.setAnswers(previous)
      this.updateProgress(previous);
      return previous
    }
    return current;
  }

  getTableQuestions(current: Question): Question[] {
    let tableQuestions: Question[] = this.originalQuestions.filter(question => question.questionParentId === current.id)
    return tableQuestions;
  }

  getProgress(): number {
    return this.progress;
  }

  updateProgress(currentQuestion: Question): void {
    let currentPosition: number = this.getCurrentIndex(currentQuestion) + 1
    let length: number = this.getFilteredLength()
    let currentProgress: number = currentPosition / length
    console.log("Current progress: " + currentProgress)
    this.progress = currentProgress
  }

}
