import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Association } from 'src/app/models/beneficiary/association';
import { Question } from 'src/app/models/question';
import { AssociationService } from 'src/app/services/association/association.service';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';

@Component({
  selector: 'app-text-data-type',
  templateUrl: './text-data-type.component.html',
  styleUrls: ['./text-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class TextDataTypeComponent implements OnInit {
  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;

  disabled: boolean = false;

  constructor(
    private detailedFormService: DetailedFormService,
    private associationService: AssociationService
  ) {}

  ngOnInit() {}

  getValue(): string {
    this.preloadValue();
    return this.formGroup.get(`${this.question.id}`)?.value;
  }

  setValue(event: any) {
    this.formGroup.get(`${this.question.id}`)?.setValue(event.target.value);
  }

  private preloadValue(): void {
    const isAssociationQuestion: boolean =
      this.question.text === 'Asociación a la que pertenece';

    const association: Association | undefined = this.getAssociation();

    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;
    if (isAssociationQuestion) {
      if (association) {
        formControl.setValue(association.name);
        this.disabled = true;
      }
    } else {
      this.disabled = false;
    }
  }

  private getAssociation(): Association | undefined {
    const associationId: number =
      this.detailedFormService.getForm().beneficiary.associationId;

    const association: Association | undefined =
      this.associationService.getAssociationById(associationId);

    return association;
  }
}
