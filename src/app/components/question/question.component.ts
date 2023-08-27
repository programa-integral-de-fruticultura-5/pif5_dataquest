import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { OpenTypeComponent } from './open-type/open-type.component';
import { Question } from 'src/app/models/question';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';
import { CommonModule } from '@angular/common';
import { AutocompleteTypeComponent } from './autocomplete-type/autocomplete-type.component';
import { MultiTypeComponent } from './multi-type/multi-type.component';
import { TableTypeComponent } from './table-type/table-type.component';
import { UniqueTypeComponent } from './unique-type/unique-type.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    OpenTypeComponent,
    DataquestHeaderComponent,
    AutocompleteTypeComponent,
    MultiTypeComponent,
    TableTypeComponent,
    UniqueTypeComponent
  ],
  standalone: true,
})
export class QuestionComponent {

  private currentQuestion!: Question

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.currentQuestion = this.questionService.getFirst()
  }

  nextQuestion(): void {
    this.currentQuestion = this.questionService.nextQuestion(this.currentQuestion)
  }

  previousQuestion(): void {
    this.currentQuestion = this.questionService.previousQuestion(this.currentQuestion)
  }

  getCategory(): string {
    return this.currentQuestion.question_category.name;
  }

  getProgress(): number {
    return this.questionService.getCurrentIndex(this.currentQuestion) / this.questionService.getLength();
  }

  getType(): string {
    console.log(this.currentQuestion.type)
    return this.currentQuestion.type;
  }
}
