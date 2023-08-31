import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';

@Component({
  selector: 'app-dataquest-header',
  templateUrl: './dataquest-header.component.html',
  styleUrls: ['./dataquest-header.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class DataquestHeaderComponent  implements OnInit {

  @Input({ transform: booleanAttribute }) progressBar: boolean = false;

  progress: number;

  constructor(private questionService: QuestionService) {
    this.progress = this.getProgress();
  }

  ngOnInit() {}

  getProgress(): number {
    return this.questionService.getProgress();
  }

}
