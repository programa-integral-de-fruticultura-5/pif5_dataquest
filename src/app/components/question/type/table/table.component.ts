import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { TypeComponent } from '../type.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    TypeComponent
  ]
})
export class TableComponent {

  @Input({required: true}) question!: any;
  @Input({required: true}) formGroup!: FormGroup;

  constructor() { }

  ngOnInit() { }

  addSection() {
    let base: Question[] = this.question.questionChildren[0];
    this.question.questionChildren.push([...base])
  }

  removeSection() {
    if (this.question.questionChildren.length > 1) {
      this.question.questionChildren.pop();
    }
  }

  getQuestionChildren(): Question[][] {
    return this.question.questionChildren;
  }

  getText(): string {
    return this.question.text;
  }

  getCategory(): string {
    return this.question.question_category.name;
  }

}
