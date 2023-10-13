import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';
import { AssociationService } from 'src/app/services/association/association.service';

@Component({
  selector: 'app-unique',
  templateUrl: './unique.component.html',
  styleUrls: ['./unique.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    AutocompleteComponent,
  ],
})
export class UniqueComponent implements OnInit {
  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  other: boolean = false;
  farming: boolean = false;

  constructor(
    private detailedFormService: DetailedFormService,
    private assoaciationService: AssociationService
  ) {}

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.question.answers;
  }

  setValue(event: any): void {
    const formGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;

    const id: string = event.detail.value;

    this.setCheckedValue(formGroup, id, true);
  }

  getValue(): string {
    const answersFormGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;

    this.preloadFarmingValue(answersFormGroup);

    const { answerId, answerValue } = this.getCheckedAnswerId(answersFormGroup);
    console.log(answerId, answerValue);
    if (answerId !== 'other')
      this.changeInputState(answersFormGroup, answerId, answerValue);

    return answerId;
  }

  private getCheckedAnswerId(answersFormGroup: FormGroup): {
    answerId: string;
    answerValue: boolean;
  } {
    let answerId: string = '';
    let answerValue: boolean = false;

    for (const key in answersFormGroup.controls) {
      const value = answersFormGroup.controls[key].value;
      if (value && key !== 'other') {
        answerId = key;
        answerValue = value;
      }
    }

    return { answerId, answerValue };
  }

  private setCheckedValue(
    answersFormGroup: FormGroup,
    id: string,
    value: boolean
  ): void {
    for (const key in answersFormGroup.controls) {
      if (key === id && key !== 'other') {
        this.changeInputState(answersFormGroup, id, value);
        answersFormGroup.controls[key].setValue(value);
      } else if (key !== 'other') {
        answersFormGroup.controls[key].setValue(!value);
      }
      console.log('key', key, 'value', answersFormGroup.controls[key].value);
    }
    console.log('Controls');
    console.log(answersFormGroup.controls);
  }

  private preloadFarmingValue(answersFormGroup: FormGroup): void {
    const isFarmingQuestion: boolean =
      this.question.text === 'Cultivo Priorizado';
    if (isFarmingQuestion) {
      const answerIdToCheck: string = this.searchAnswerIdByFarming();
      this.setCheckedValue(answersFormGroup, answerIdToCheck, true);
      this.farming = true;
    } else {
      this.farming = false;
    }
  }

  private searchAnswerIdByFarming(): string {
    const associationId: number =
      this.detailedFormService.getForm().beneficiary.associationId;

    const associationFarming: string =
      this.assoaciationService.getAssociationById(associationId)!.farming;

    const answer: Answer = this.question.answers.find(
      (answer) => answer.value === associationFarming
    )!;

    return answer.id.toString();
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

  private changeInputState(
    answerGroup: FormGroup,
    id: string,
    value: boolean
  ): void {
    if (this.isLastAnswer(id) && value) {
      this.other = true;
      answerGroup.get('other')?.enable();
    } else {
      this.other = false;
      answerGroup.get('other')?.disable();
    }
  }

  private isLastAnswer(id: string): boolean {
    const answers: Answer[] = this.getAnswers();
    const lastAnswer: Answer = answers[answers.length - 1];
    return Number(id) === lastAnswer.id;
  }
}
