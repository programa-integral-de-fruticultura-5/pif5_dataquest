import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, ReactiveFormsModule ]
})
export class MultipleComponent implements OnInit {

  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  other: boolean = false;

  constructor() { }

  ngOnInit() {}

  getAnswers(): FormDetail.Answer[] {
    return this.question.answers;
  }

  isChecked(answer: FormDetail.Answer): boolean {
    const formGroup: FormGroup = this.formGroup.get(`${this.question.id}`) as FormGroup;

    const formControl: AbstractControl | null = formGroup.get(answer.id.toString());

    if (formControl) {
      const value: boolean = formControl.value;
      this.changeInputState(formGroup, answer.id.toString(), value);
      return value;
    }

    return false;
  }

  checkAnswer(event: Event, id: number): void {
    const formGroup: FormGroup = this.formGroup.get(`${this.question.id}`) as FormGroup;

    const element: HTMLInputElement = event.target as HTMLInputElement;
    const value: boolean = element.checked;

    this.setCheckedValue(formGroup, value, id);
  }

  setCheckedValue(formGroup: FormGroup, value: boolean, id: number): void {
    const formControl: AbstractControl | null = formGroup.get(id.toString());

    if (formControl) {
      this.changeInputState(formGroup, id.toString(), value);
      formControl.setValue(value);
    }
  }

  getTextValue(): string {
    const answerGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    const otherValue: string = answerGroup.get('other')?.value;
    return otherValue;
  }

  setTextValue(event: any): void {
    const answerGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    const otherValue: string = event.detail.value;
    answerGroup.get('other')?.setValue(otherValue);
  }

  private changeInputState(answerGroup: FormGroup, id: string, value: boolean): void {

    if (this.isLastAnswer(id) && value) {
      this.other = true;
      answerGroup.get('other')?.enable();
    } else if (this.isLastAnswer(id) && !value) {
      this.other = false;
      answerGroup.get('other')?.disable();
    }
  }

  private isLastAnswer(id: string): boolean {
    const answers: FormDetail.Answer[] = this.getAnswers();
    const lastAnswer: FormDetail.Answer = answers[answers.length - 1];
    return Number(id) === lastAnswer.id;
  }
}
