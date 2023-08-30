import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';

@Component({
  selector: 'app-multiple',
  templateUrl: './multiple.component.html',
  styleUrls: ['./multiple.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ]
})
export class MultipleComponent  implements OnInit {

  @Input({ required: true }) questionType: string = '';

  constructor(private answerService: AnswerService) { }

  ngOnInit() {}

  getAnswers(): Answer[] {
    return this.answerService.getAnswers();
  }

  setValue(event: any): void {
    let value = event.detail.value
  }

}
