import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'

@Component({
  selector: 'app-text-area-data-type',
  templateUrl: './text-area-data-type.component.html',
  styleUrls: ['./text-area-data-type.component.scss'],
  standalone : true,
  imports: [ IonicModule, ReactiveFormsModule ],
})
export class TextAreaDataTypeComponent  implements OnInit {

  @Input({ required: true }) question!: FormDetail.Question
  @Input({ required: true }) formGroup!: FormGroup
  @Input({ required: true }) disabled!: boolean

  constructor() { }

  ngOnInit() {}

  getValue(): string {
    return this.formGroup.get(`${this.question.id}`)?.value;
  }

  setValue(event: any) {
    this.formGroup.get(`${this.question.id}`)?.setValue(event.target.value);
  }

}
