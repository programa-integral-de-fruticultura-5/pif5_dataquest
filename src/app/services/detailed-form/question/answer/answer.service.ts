import { Injectable } from '@angular/core';
import { Answer } from 'src/app/models/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  private answers!: Answer[];

  constructor() { }

  getAnswers(): Answer[] {
    return this.answers;
  }

  setAnswers(answers: Answer[]): void {
    this.answers = answers;
  }
}
