import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { format, formatISO, parseISO } from 'date-fns';

@Component({
  selector: 'app-date-data-type',
  templateUrl: './date-data-type.component.html',
  styleUrls: ['./date-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule, ReactiveFormsModule ],
})
export class DateDataTypeComponent  implements OnInit {

  @Input({ required: true }) question!: Question
  @Input({ required: true }) formGroup!: FormGroup

  constructor() { }

  ngOnInit() { }

  getValue(): string {
    let value: string = this.formGroup.get(`${this.question.id}`)?.value;
    let date: Date = value ? parseISO(value) : new Date();
    return formatISO(date)
  }

  setValue(event: any): void {
    this.formGroup.get(`${this.question.id}`)?.setValue(event.detail.value);
  }

  getMinToMaxDate(): string {
    let maxDate: string = this.question.min ? formatISO(new Date()) : '';
    return maxDate;
  }

  getMaxToMinDate(): string {
    let minDate: string = this.question.max ? this.substractYears(this.question.max) : '';
    return minDate;
  }

  substractYears(years: number): string {
    let date: Date = new Date();
    date.setFullYear(date.getFullYear() + years);
    return formatISO(date);
  }

}
