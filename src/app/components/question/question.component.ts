import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { Question } from 'src/app/models/question';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';
import { CommonModule } from '@angular/common';
import { TableComponent } from './type/table/table.component';
import { TypeComponent } from './type/type.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Form } from 'src/app/models/form';

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
      this.saveResponse(this.currentQuestion, this.formGroup)
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

  private saveResponse(question: Question, formGroup: FormGroup): void {
    let type = question.type;

      if (type === 'Abierta') {
        this.saveOpenResponse(question, formGroup);
      }

      if(type === 'Autocomplete' || type === 'Única respuesta' || type === 'Única respuesta con otro' || type === 'Única respuesta con select') {
        this.saveUniqueResponse(question, formGroup);
      }

      if (type === 'Múltiple respuesta' || type === 'Múltiple respuesta con otro') {
        this.saveMultipleResponse(question, formGroup);
      }

      if (type === 'Tabla') {
        this.saveTableResponse(question, formGroup);
      }

  }

  private saveTableResponse(question: Question, formGroup: FormGroup) {
    let questionFormArray: FormArray = formGroup.controls[question.id] as FormArray;
    this.currentQuestion.questionChildren.forEach((section, index) => {
      let sectionFormGroup: FormGroup = questionFormArray.at(index) as FormGroup;
      section.forEach((child) => {
        this.saveResponse(child, sectionFormGroup);
      });
    });
  }

  private saveMultipleResponse(question: Question, formGroup: FormGroup) {
    let response = formGroup.controls[this.currentQuestion.id].value
    let answers = question.answers
    answers.forEach(answer => {
      answer.checked = response[answer.id]
    })
  }

  private saveUniqueResponse(question: Question, formGroup: FormGroup) {
    let response = formGroup.controls[this.currentQuestion.id].value
    let answers = question.answers
    answers.find(answer => answer.value === response)!.checked = true
  }

  private saveOpenResponse(question: Question, formGroup: FormGroup) {
    let response = formGroup.controls[this.currentQuestion.id].value
    let value = question.answers[0].value
    value = response
  }


}
