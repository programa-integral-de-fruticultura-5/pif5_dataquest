import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { Form } from 'src/app/models/form';
import { Question } from 'src/app/models/question';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';

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

  constructor(private answerService: AnswerService) { }

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.answerService.getAnswers();
  }

  getFormGroup() {
    return this.formGroup.get(`${this.question.id}`) as FormGroup;
  }

  onCheckboxChange(event: any): void {
    const checkedArray: FormArray = this.formGroup.get(`${this.question.id}`) as FormArray;
    if (event.detail.checked) {
      checkedArray.push(new FormControl(event.detail.value));
    } else {
      let i: number = 0;
      checkedArray.controls.forEach((item: AbstractControl) => {
        if (item.value == event.detail.value) {
          checkedArray.removeAt(i);
          return;
        }
        i++;
      });
    }

    console.log(this.formGroup.get(`${this.question.id}`)?.value);
  }
}
