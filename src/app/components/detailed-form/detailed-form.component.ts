import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { FormService } from 'src/app/services/form/form.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';
import { Form } from 'src/app/models/form';
import { QuestionComponent } from '../question/question.component';
import { DataquestHeaderComponent } from '../header/dataquest-header/dataquest-header.component';

@Component({
  selector: 'app-detailed-form',
  templateUrl: './detailed-form.component.html',
  styleUrls: ['./detailed-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    QuestionComponent,
    DataquestHeaderComponent,
  ],
})
export class DetailedFormComponent {
  component = QuestionComponent;

  constructor(
    private detailedFormService: DetailedFormService,
    private formService: FormService,
    private alertController: AlertController,
    private navController: NavController
  ) {}

  getForm(): Form {
    return this.detailedFormService.getForm();
  }

  isForm(): boolean {
    return this.detailedFormService.isForm();
  }

  isDraft(): boolean {
    return this.detailedFormService.isDraft();
  }

  isSurvey(): boolean {
    return this.detailedFormService.isSurvey();
  }

  startForm(): void {
    this.getLocation();
    this.detailedFormService.startDraft();
  }

  viewSurvey(): void {

  }

  resumeDraft(): void {

  }

  private async getLocation(): Promise<void> {
    try {
      const permissions = await Geolocation.checkPermissions();

      if (permissions.location !== 'granted') {
        const permissionAlert = await this.alertController.create({
          header: 'Problema con los permisos',
          message:
            'No se pudo obtener los permisos de ubicación del dispositivo. Por favor, habilita los permisos de ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
          buttons: ['OK'],
        });

        const permissionResult = await Geolocation.requestPermissions();

        if (permissionResult.location !== 'granted') {
          permissionAlert.present();
          return;
        }
      }
      const locationAlert = await this.alertController.create({
        header: 'Problema con la ubicación',
        message:
          'No se pudo obtener la ubicación del dispositivo. Por favor, habilita la ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
        buttons: ['OK'],
      });

      const position = await Geolocation.getCurrentPosition();

      if (position) {
        console.log(position.coords);
        this.getForm().position =
          position.coords.latitude + ',' + position.coords.longitude;
        this.getForm().altitud = position.coords.altitude ?? 0;
        console.log(
          'Position: ',
          position,
          ', Altitude: ',
          this.getForm().altitud
        );
      } else {
        locationAlert.present();
      }
    } catch (error) {
      const locationAlert = await this.alertController.create({
        header: 'Servicios de ubicación deshabilitados',
        message:
          'No se pudo obtener la ubicación del dispositivo. Por favor, habilita la ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
        buttons: ['OK'],
      });
      locationAlert.present();
      this.navController.pop();
    }
  }

  getTotalQuestions(): number {
    return this.detailedFormService.getTotalQuestions();
  }

  getTransformedDownladedDate() {
    const date = new Date(this.getForm().fechaDescarga);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  }
}
