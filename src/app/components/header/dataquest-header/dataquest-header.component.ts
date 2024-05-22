import { Component, EventEmitter, Input, OnInit, Output, booleanAttribute } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';
import { QuestionService } from '@services/detailed-form/question/question.service';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';

@Component({
  selector: 'app-dataquest-header',
  templateUrl: './dataquest-header.component.html',
  styleUrls: ['./dataquest-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DataquestHeaderComponent implements OnInit {
  @Input({ transform: booleanAttribute }) progressBar: boolean = false;
  @Output() confirmExit = new EventEmitter<number>();

  progress: number;

  constructor(
    private questionService: QuestionService,
    private alertController: AlertController,
    private location: Location,
    private detailedFormService: DetailedFormService,
  ) {
    this.progress = this.getProgress();
  }

  ngOnInit() {}

  getProgress(): number {
    return this.questionService.getProgress();
  }

  back() {
    if (this.detailedFormService.isQuestionsPage())
      this.confirmExit.emit();
    else
      this.location.back();
  }

  isForm(): boolean {
    return this.detailedFormService.isForm();
  }

  isDraft(): boolean {
    return this.detailedFormService.isDraft();
  }

}
