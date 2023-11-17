import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { TypeaheadComponent } from '@components/typeahead/typeahead.component';
import { FormDetail } from '@models/FormDetail.namespace';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { AssociationService } from '@services/association/association.service';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { ProducerService } from '@services/producer/producer.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TypeaheadComponent],
})
export class AutocompleteComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ transform: booleanAttribute }) open!: boolean;
  @Input() title = 'Selecciona uno';
  @Input({ required: true }) disabled!: boolean;

  selection!: string;
  public answersData!: FormDetail.Answer[];
  public producersData!: Beneficiary.Producer[];
  public associationsData!: Beneficiary.Association[];
  public data!: string[];

  constructor(
    private producersService: ProducerService,
    private associationService: AssociationService,
    private detailedFormService: DetailedFormService
  ) {}

  ngOnInit() {
    this.selection = this.getQuestionValue();
    this.data = this.getData();
  }

  openModal(): void {
    this.modal.present();
  }

  private getQuestionValue(): string {
    const answers: FormGroup = this.formGroup.get(
      `${this.question.id}`
    ) as FormGroup;
    let value: string = '';
    if (this.open) {
      const formControl: FormControl = this.formGroup.get(
        `${this.question.id}`
      ) as FormControl;
      value = formControl.value;
    } else {
      value = this.getSelectedValue(answers);
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

  private getData(): string[] {
    let result: string[] = [];
    if (this.open) {
      const producers: Beneficiary.Producer[] = (this.producersData = this.getProducers());
      const associations: Beneficiary.Association[] = (this.associationsData =
        this.getAssociations());
      result = producers.map((producer) => producer.id);
    } else {
      const answers: FormDetail.Answer[] = (this.answersData = this.getAnswers());
      result = answers.map((answer) => answer.value);
    }
    return result;
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

  selectionChanged(selection: string) {
    this.selection = selection;

    if (this.open) {
      this.assignBeneficiary(selection);
      const formControl: FormControl = this.formGroup.get(
        `${this.question.id}`
      ) as FormControl;
      formControl.setValue(selection);
    } else {
      const formGroup: FormGroup = this.formGroup.get(
        `${this.question.id}`
      ) as FormGroup;
      const answerId: string = this.getAnswerId(selection);
      this.setCheckedValue(formGroup, answerId);
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

  private assignBeneficiary(id: string): void {
    const beneficiary: Beneficiary.Producer | undefined = this.producersData.find(
      (producer) => producer.id === id
    );

    beneficiary ? this.detailedFormService.setBeneficiary(beneficiary) : null;
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
