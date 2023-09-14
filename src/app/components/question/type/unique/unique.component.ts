import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';

@Component({
  selector: 'app-unique',
  templateUrl: './unique.component.html',
  styleUrls: ['./unique.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, ReactiveFormsModule ]
})
export class UniqueComponent  implements OnInit {

  @Input({ required: true }) question!: Question;
  @Input({ required: true }) formGroup!: FormGroup;

  constructor(private answerService: AnswerService) { }

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.answerService.getAnswers();
  }

  setValue(event: any): void {
    this.formGroup.get(`${this.question.id}`)?.setValue(event.detail.value);
  }

  getValue(): string {
    return this.formGroup.get(`${this.question.id}`)?.value;
  }

}
