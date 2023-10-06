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
  imports: [IonicModule, ReactiveFormsModule],
})
export class DateDataTypeComponent implements OnInit {
  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  constructor() {}

  ngOnInit() {}

  getValue(): string {
    let value: string = this.formGroup.get(`${this.question.id}`)?.value;
    let date: Date = value ? parseISO(value) : new Date();
    return formatISO(date);
  }

  setValue(event: any): void {
    this.formGroup.get(`${this.question.id}`)?.setValue(event.detail.value);
  }

  getMinToMaxDate(): string | undefined {
    const date: Date = new Date();
    const maxDate: string | undefined = this.question.min
      ? date.toISOString()
      : undefined;
    return maxDate;
  }

  getMaxToMinDate(): string | undefined {
    const minDate: string | undefined = this.question.max
      ? this.substractYears(Number(this.question.max))
      : undefined;
    return minDate;
  }

  private substractYears(years: number): string {
    const date: Date = new Date();
    const newYear: number = date.getFullYear() + years;
    date.setFullYear(newYear);
    const formattedDate: string = date.toISOString();
    return formattedDate;
  }
}
