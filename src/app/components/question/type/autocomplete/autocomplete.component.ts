import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { TypeaheadComponent } from 'src/app/components/typeahead/typeahead.component';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';
import { AssociationService } from 'src/app/services/association/association.service';
import { ProducerService } from 'src/app/services/producer/producer.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TypeaheadComponent],
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() title = 'Selecciona uno';

  selection!: any;
  public answersData!: any[];
  public producersData!: any[];
  public associationsData!: any[];
  public data!: any[];
  // private results!: any[];

  constructor(
    private producersService: ProducerService,
    private associationService: AssociationService
  ) {}

  ngOnInit() {
    this.selection = this.getQuestionValue();
    this.answersData = this.getAnswers();
    this.producersData = this.getProducers();
    this.associationsData = this.getAssociations();
    this.data = this.getData();
  }

  private getQuestionValue(): string {
    const answers: FormGroup = this.formGroup.get(`${this.question.id}`) as FormGroup;
    let value: string = '';
    if (this.question.type === 'Autocomplete' || this.question.type === 'Única respuesta con select') {
      value = this.getSelectedValue(answers);
    } else {
      value = this.formGroup.get(`${this.question.id}`)?.value;
    }
    return value;
  }

  private getSelectedValue(answersFormGroup: FormGroup): string {
    let selectedValue: string = '';
    for (const key in answersFormGroup.controls) {
      if (answersFormGroup.controls[key].value) {
        selectedValue = this.question.answers.find(
          (answer) => answer.id.toString() === key
        )?.value as string;
      }
    }
    return selectedValue;
  }

  private hasAnswers(): boolean {
    return this.answersData.length > 1;
  }

  private getData(): string[] {
    if (this.hasAnswers()) {
      let stringAnswers = this.answersData.map((answer) => answer.value);
      return stringAnswers;
    } else {
      let stringProducers = this.producersData.map(
        (producer) => producer.identification
      );
      return stringProducers;
    }
  }

  getAnswers() {
    return this.question.answers;
  }

  getProducers() {
    return this.producersService.getProducers();
  }

  getAssociations() {
    return this.associationService.getAssociations();
  }

  /*   getResults() {
    return this.results;
  } */

  selectionChanged(selection: string) {
    this.selection = selection;
    const formGroup: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    const answerId: string = this.getAnswerId(selection);

    const type: string = this.question.type;
    if (type === 'Autocomplete' || type === 'Única respuesta con select') {
      console.log("Autocomplete")
      this.setCheckedValue(formGroup, answerId);
    } else {
      this.formGroup.get(`${this.question.id}`)?.setValue(selection);
    }
    this.modal.dismiss();
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

  private getAnswerId(value: string): string {
    let id: string = '';
    this.answersData.find((answer) => {
      if (answer.value === value) {
        id = answer.id.toString();
      }
    });
    return id;
  }
}
