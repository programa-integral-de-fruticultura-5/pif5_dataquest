import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-month-data-type',
  templateUrl: './month-data-type.component.html',
  styleUrls: ['./month-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule, ReactiveFormsModule ],
})
export class MonthDataTypeComponent  implements OnInit {

  @Input({ required: true }) question!: Question
  @Input({ required: true }) formGroup!: FormGroup

  constructor() { }

  ngOnInit() {}

  onChange(event: any) {
    this.formGroup.controls[this.question.id].setValue(event.detail.value)
  }

  getValue(): string {
    return this.formGroup.controls[this.question.id].value
  }

}
