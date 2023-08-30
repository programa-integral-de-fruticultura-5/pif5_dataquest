import { Component, Input, OnInit } from '@angular/core';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { OpenComponent } from './open/open.component';
import { MultipleComponent } from './multiple/multiple.component';
import { UniqueComponent } from './unique/unique.component';
import { Question } from 'src/app/models/question';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    AutocompleteComponent,
    OpenComponent,
    MultipleComponent,
    UniqueComponent
  ]
})
export class TypeComponent implements OnInit {

  @Input({ required: true }) question!: Question

  constructor(private answerService: AnswerService) { }

  ngOnInit() {
    this.answerService.setAnswers(this.question.answers);
  }

  getCategory(): string {
    return this.question.question_category.name;
  }

  getType(): string {
    return this.question.type;
  }

  getDataType(): string {
    return this.question.dataType;
  }

  getText(): string {
    return this.question.text;
  }
}
