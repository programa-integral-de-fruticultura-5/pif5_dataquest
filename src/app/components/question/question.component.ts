import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { Question } from 'src/app/models/question';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from './type/table/table.component';
import { TypeComponent } from './type/type.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    TypeComponent,
    TableComponent,
    DataquestHeaderComponent,
    ReactiveFormsModule
  ],
  standalone: true,
})
export class QuestionComponent {

  currentQuestion!: Question
  formGroup!: FormGroup

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.currentQuestion = this.questionService.getFirst()
    this.formGroup = this.questionService.getFormGroup()
  }

  nextQuestion(): void {
    if (this.isValid()) {
      this.currentQuestion = this.questionService.nextQuestion(this.currentQuestion)
    } else {
      console.log('invalid')
    }
  }

  previousQuestion(): void {
    this.currentQuestion = this.questionService.previousQuestion(this.currentQuestion)
  }

  onSubmit() {

  }

  getCategory(): string {
    return this.currentQuestion.question_category.name;
  }

  getType(): string {
    return this.currentQuestion.type;
  }

  isValid() {
    return this.formGroup.controls[this.currentQuestion.id].valid;
  }

  isLastQuestion(): boolean {
    let question: Question = this.currentQuestion
    let lastQuestion: Question = this.questionService.getLast()
    return question.id === lastQuestion.id
  }

  isFirstQuestion(): boolean {
    let question: Question = this.currentQuestion
    let firstQuestion: Question = this.questionService.getFirst()
    return question.id === firstQuestion.id
  }

}
