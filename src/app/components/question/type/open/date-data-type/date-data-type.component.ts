import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'

@Component({
  selector: 'app-date-data-type',
  templateUrl: './date-data-type.component.html',
  styleUrls: ['./date-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class DateDataTypeComponent {
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  constructor() {}

  getValue(): string {
    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;
    console.log('formControl: ', formControl)
    const stringDate: string = this.formGroup.get(`${this.question.id}`)?.value;
    console.log('stringDate: ', stringDate);
    if (!stringDate) {
      const today: Date = new Date();
      return today.toISOString();
    }
    const [day, month, year] = stringDate.split('/');
    const parsedDate: Date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
    console.log('date: ', parsedDate.toISOString());
    return parsedDate.toISOString();
  }

  setValue(event: Event): void {
    const questionFormControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;
    const dateTimeElement = event.target as HTMLInputElement;
    const value: string = dateTimeElement.value;
    const date: Date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const stringDate: string = date.toLocaleDateString('es-ES', options);
    questionFormControl.setValue(stringDate);
  }

  getMaxDate(): string | undefined {
    const maxDate: string | undefined = this.question.max
      ? this.getNewYear(Number(this.question.max), true)
      : undefined;
    return maxDate;
  }

  getMinDate(): string | undefined {
    const minDate: string | undefined = this.question.min
      ? this.getNewYear(Number(this.question.min), false)
      : undefined;
    return minDate;
  }

  private getNewYear(years: number, sum: boolean): string {
    console.log(years, sum);
    const date: Date = new Date();
    const newYear: number = sum
      ? date.getFullYear() + years
      : date.getFullYear() - years;
    date.setFullYear(newYear);
    const formattedDate: string = date.toISOString();
    return formattedDate;
  }
}
