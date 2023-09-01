import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { OpenComponent } from './type/open/open.component';
import { Question } from 'src/app/models/question';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './type/autocomplete/autocomplete.component';
import { MultipleComponent } from './type/multiple/multiple.component';
import { TableComponent } from './type/table/table.component';
import { UniqueComponent } from './type/unique/unique.component';
import { TypeComponent } from './type/type.component';

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
  ],
  standalone: true,
})
export class QuestionComponent {

  currentQuestion!: Question

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

  getType(): string {
    return this.currentQuestion.type;
  }
}
