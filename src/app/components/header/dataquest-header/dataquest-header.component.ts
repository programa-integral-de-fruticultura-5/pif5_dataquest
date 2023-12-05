import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { QuestionService } from '@services/detailed-form/question/question.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.progress = this.getProgress();
  }

  ngOnInit() {}

  getProgress(): number {
    return this.questionService.getProgress();
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      header: '¿Desea salir?',
      message: 'Si sale, su progreso se guardará como borrador.',
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
            this.router.navigate(['/home'])
          }
        },
      ],
    });

    await alert.present();
  }
}
