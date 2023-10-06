import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
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

  disabled: boolean = false;

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

    const value: string = event.detail.value;

    this.setCheckedValue(formGroup, value);
  }

  getValue(): string {
    const answersFormGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;

    this.preloadFarmingValue(answersFormGroup);

    const id: string = this.getCheckedAnswerId(answersFormGroup);
    return id;
  }

  private getCheckedAnswerId(answersFormGroup: FormGroup): string {
    let id: string = '';

    for (const key in answersFormGroup.controls) {
      if (answersFormGroup.controls[key].value) {
        id = key;
      }
    }

    return id;
  }

  private setCheckedValue(answersFormGroup: FormGroup, id: string): void {
    for (const key in answersFormGroup.controls) {
      if (key === id) {
        answersFormGroup.controls[key].setValue(true);
      } else {
        answersFormGroup.controls[key].setValue(false);
      }
    }
  }

  private preloadFarmingValue(answersFormGroup: FormGroup): void {
    const isFarmingQuestion: boolean = this.question.text === 'Cultivo Priorizado';
    console.log('isFarmingQuestion', isFarmingQuestion);
    if (isFarmingQuestion) {
      const answerIdToCheck: string = this.searchAnswerIdByFarming();
      console.log('answerIdToCheck', answerIdToCheck);
      this.setCheckedValue(answersFormGroup, answerIdToCheck);
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

  private searchAnswerIdByFarming(): string {
    const associationId: number =
      this.detailedFormService.getForm().beneficiary.associationId;

    console.log('associationId', associationId);
    const associationFarming: string =
      this.assoaciationService.getAssociationById(associationId)!.farming;

    console.log('associationFarming', associationFarming);
    const answer: Answer = this.question.answers.find(
      (answer) => answer.value === associationFarming
    )!;

    console.log('answer', answer)
    return answer.id.toString();
  }
}
