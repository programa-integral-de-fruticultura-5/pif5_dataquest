import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { Form } from 'src/app/models/form';
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

  constructor() { }

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.question.answers;
  }

  getFormGroup() {
    return this.formGroup.get(`${this.question.id}`) as FormGroup;
  }

}
