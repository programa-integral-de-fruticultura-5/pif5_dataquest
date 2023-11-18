import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { FormDetail } from '@models/FormDetail.namespace'
import { AssociationService } from '@services/association/association.service';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';

@Component({
  selector: 'app-text-data-type',
  templateUrl: './text-data-type.component.html',
  styleUrls: ['./text-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule],
})
export class TextDataTypeComponent implements OnInit {
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

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

  private async preloadValue(): Promise<void> {
    const isAssociationQuestion: boolean =
      this.question.text === 'Asociación a la que pertenece';

    const association: Beneficiary.Association | undefined = await this.getAssociation();

    const formControl: FormControl = this.formGroup.get(
      `${this.question.id}`
    ) as FormControl;
    if (isAssociationQuestion) {
      if (association) {
        formControl.setValue(association.name);
        this.disabled = true;
      }
    }
  }

  private async getAssociation(): Promise<Beneficiary.Association | undefined> {
    const associationId: number =
      this.detailedFormService.getForm().beneficiary.associationId;

    const association: Beneficiary.Association | undefined =
      await this.associationService.getAssociationById(associationId);

    return association;
  }
}
