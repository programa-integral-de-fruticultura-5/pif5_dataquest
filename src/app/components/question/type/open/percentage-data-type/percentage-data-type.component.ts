import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'

@Component({
  selector: 'app-percentage-data-type',
  templateUrl: './percentage-data-type.component.html',
  styleUrls: ['./percentage-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class PercentageDataTypeComponent {
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  constructor(private alertController: AlertController) {}

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
    return this.formGroup.get(`${this.question.id}`)?.value;
  }

  async setValue(event: Event) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;

    formControl.setValue(element.value);

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

  getPlaceholder(): string {
    let message: string = 'Ingrese un valor';
    if (this.question.min && this.question.max)
      message += ` entre ${this.question.min} y ${this.question.max}`;
    else if (this.question.min) message += ` mayor a ${this.question.min}`;
    else if (this.question.max) message += ` menor a ${this.question.max}`;
    return message;
  }
}
