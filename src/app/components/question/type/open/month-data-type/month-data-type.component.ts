import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  @Input({ required: true }) disabled!: boolean

  constructor() { }

  ngOnInit() {}

  onChange(event: any) {
    this.formGroup.controls[this.question.id].setValue(event.detail.value)
  }

  getValue(): string {
    const control: FormControl = this.formGroup.controls[this.question.id] as FormControl

    const date: Date = control.value ? new Date(control.value) : new Date()
    return date.toISOString()
  }

}
