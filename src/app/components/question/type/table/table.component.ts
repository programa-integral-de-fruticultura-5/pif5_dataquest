import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { TypeComponent } from '../type.component';

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
export class TableComponent  implements OnInit {

  @Input({required: true}) base: Question[] = [];
  tableQuestions: Question[][] = [];

  constructor() { }

  ngOnInit() {
    this.tableQuestions.push(this.base)
  }

  addSection() {
    this.tableQuestions.push(this.base)
  }

  removeSection() {
    if (this.tableQuestions.length > 1) {
      this.tableQuestions.pop();
    }
  }

}
