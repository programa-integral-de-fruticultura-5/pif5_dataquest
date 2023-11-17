import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'

@Component({
  selector: 'app-phone-data-type',
  templateUrl: './phone-data-type.component.html',
  styleUrls: ['./phone-data-type.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PhoneDataTypeComponent implements OnInit {
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  phones!: FormDetail.Answer[];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.phones = this.question.answers;
  }

  getValue(order: number): string {
    const formGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    const formControl: FormControl = formGroup.get(`${order}`) as FormControl;
    return formControl.value;
  }

  async setValue(event: any, order: number) {
    if (event.target.value.length < 10) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El número de teléfono debe tener 10 dígitos',
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const formGroup: FormGroup = this.formGroup.get(
        `${this.question.id}`
      ) as FormGroup;
      const formControl: FormControl = formGroup.get(`${order}`) as FormControl;
      formControl.setValue(event.target.value);
    }
  }

  addPhone(): void {
    const formGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    const lastPhone: FormDetail.Answer =
      this.question.answers[this.question.answers.length - 1];
    const phone: FormDetail.Answer = { ...lastPhone };
    phone.order = lastPhone.order + 1;
    phone.value = '';
    this.phones.push(phone);
    formGroup.addControl(
      `${phone.order}`,
      new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ])
    );
  }

  removePhone(): void {
    const formGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    formGroup.removeControl(`${this.phones[this.phones.length - 1].order}`);
    this.phones.pop();
  }
}
