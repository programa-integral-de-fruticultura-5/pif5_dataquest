import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { OpenTypeComponent } from './open-type/open-type.component';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [IonicModule, OpenTypeComponent ],
  standalone: true,
})
export class QuestionComponent {

  private currentQuestion!: Question

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.currentQuestion = this.questionService.getFirst()
  }

  nextQuestion(): void {
    this.currentQuestion = this.questionService.nextQuestion(this.currentQuestion)
  }

  previousQuestion(): void {
    this.currentQuestion = this.questionService.previousQuestion(this.currentQuestion)
  }

  getCategory(): string {
    return this.currentQuestion.question_category.name;
  }

  getProgress(): number {
    return this.questionService.getCurrentIndex(this.currentQuestion) / this.questionService.getLength();
  }
}
