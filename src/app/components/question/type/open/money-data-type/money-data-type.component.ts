import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from '@maskito/kit';
import { MaskitoModule } from '@maskito/angular';
import { MaskitoElementPredicateAsync, MaskitoOptions } from '@maskito/core';

@Component({
  selector: 'app-money-data-type',
  templateUrl: './money-data-type.component.html',
  styleUrls: ['./money-data-type.component.scss'],
  standalone: true,
  imports: [MaskitoModule, IonicModule, ReactiveFormsModule],
})
export class MoneyDataTypeComponent {
  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) =>
    (el as HTMLIonInputElement).getInputElement();

  readonly moneyMask: MaskitoOptions = maskitoNumberOptionsGenerator({
    decimalZeroPadding: true,
    prefix: '$',
    thousandSeparator: ',',
    decimalSeparator: '.',
    precision: 2,
  });

  constructor(
    private alertController: AlertController,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnChanges() {
    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;

    if (this.question.min)
      formControl.addValidators(Validators.min(this.question.min));
    if (this.question.max)
      formControl.addValidators(Validators.max(this.question.max));
  }

  getValue(): string {
    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;

    const currency: string = this.currencyPipe.transform(
      formControl.value,
      'COP',
      '$',
    )!;

    return currency;
  }

  async setValue(event: Event): Promise<void> {
    const element: HTMLIonInputElement = event.target as HTMLIonInputElement;
    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;

    formControl.setValue(maskitoParseNumber(element.value as string));

    if (formControl.getError('min')) {
      const minAlert: HTMLIonAlertElement = await this.alertController.create({
        header: 'Valor mínimo',
        message: `El valor mínimo es ${this.question.min}`,
        buttons: ['OK'],
      });

      await minAlert.present();
    } else if (formControl.getError('max')) {
      const maxAlert: HTMLIonAlertElement = await this.alertController.create({
        header: 'Valor máximo',
        message: `El valor máximo es ${this.question.max}`,
        buttons: ['OK'],
      });

      await maxAlert.present();
    }
  }

  getHelperText(): string {
    let message: string = 'Ingrese un valor';
    const minCurrency: string = this.currencyPipe.transform(
      this.question.min,
      'COP',
      '$',
      '1.2-2'
    )!;
    const maxCurrency: string = this.currencyPipe.transform(
      this.question.max,
      'COP',
      '$',
      '1.2-2'
    )!;
    if (this.question.min && this.question.max)
      message += ` entre ${minCurrency} y ${maxCurrency}`;
    else if (this.question.min) message += ` mayor a ${minCurrency}`;
    else if (this.question.max) message += ` menor a ${maxCurrency}`;
    return message;
  }
}
