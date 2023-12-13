import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
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
      this.confirmExit();
    else
      this.location.back();
  }

  private async confirmExit() {
    var message: string = ''
    if (this.isForm())
      message = 'Si sale, su progreso se guardará como borrador. ¿Desea salir?';
    else if (this.isDraft())
      message = 'Si sale, se guardará el borrador. ¿Desea salir?';

    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Salir',
          role: 'confirm',
          cssClass: 'danger',
          handler: () => {
            this.location.back();
          },
        },
      ],
    });

    await alert.present();
  }

  isForm(): boolean {
    return this.detailedFormService.isForm();
  }

  isDraft(): boolean {
    return this.detailedFormService.isDraft();
  }

}
