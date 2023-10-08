import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, ReactiveFormsModule ]
})
export class MultipleComponent implements OnInit {

  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  other: boolean = false;

  constructor() { }

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.question.answers;
  }

  isChecked(answer: Answer): boolean {
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
    const answer: Answer | undefined = this.question.answers.find(
      (answer) => answer.id.toString() === id
    );
    if (answer?.value.includes('Otro, ¿cuál?') && value) {
      this.other = true;
      answerGroup.get('other')?.enable();
    } else if (answer?.value.includes('Otro, ¿cuál?') && !value) {
      this.other = false;
      answerGroup.get('other')?.disable();
    }
  }

}
