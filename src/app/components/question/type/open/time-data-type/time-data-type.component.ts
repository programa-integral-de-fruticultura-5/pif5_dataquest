import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormDetail } from '@models/FormDetail.namespace';
import { IonicModule, PickerButton, PickerColumn } from '@ionic/angular';

@Component({
  selector: 'app-time-data-type',
  templateUrl: './time-data-type.component.html',
  styleUrls: ['./time-data-type.component.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class TimeDataTypeComponent {

  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  columns: PickerColumn[] = [
    {
      name: 'hour',
      options: this.generateOptions(24) // Generate options for hours (0-23)
    },
    {
      name: 'minute',
      options: this.generateOptions(60) // Generate options for minutes (0-59)
    }
  ]

  buttons: PickerButton[] = [
    {
      text: 'Cancelar',
      role: 'cancel'
    },
    {
      text: 'Confirmar',
      handler: (value: TimeValue) => {
        this.setValue(value);
      }
    }
  ]

  constructor() { }

  private generateOptions(count: number): { text: string, value: number }[] {
    const options = [];
    for (let i = 0; i < count; i++) {
      options.push({
        text: i.toString().padStart(2, '0'),
        value: i
      });
    }
    return options;
  }

  getValue(): string {
    const formControl = this.formGroup.get(`${this.question.id}`);
    const timeValue = formControl?.value;
    return timeValue ? timeValue : 'Selecciona la hora';
  }

  setValue(value: TimeValue): void {
    const questionFormControl = this.formGroup.get(`${this.question.id}`);
    const hour: TimeOption = value.hour
    const minute: TimeOption = value.minute
    const time: string = `${hour.text}:${minute.text}`;
    console.log(`Selected time: ${time}`);
    questionFormControl?.setValue(time);
  }
}

type TimeValue = {
  hour: TimeOption;
  minute: TimeOption;
}

type TimeOption = {
  text: string;
  value: number;
  columnIndex: number;
}
