import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
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
  imports: [CommonModule, IonicModule, QuestionComponent, DataquestHeaderComponent ],
})
export class DetailedFormComponent {

  component = QuestionComponent

  constructor(
    private detailedFormService: DetailedFormService,
    private formService: FormService,
    private alertController: AlertController
  ) { }

  getForm(): Form {
    return this.detailedFormService.getForm();
  }

  // TODO move location logic to service

/*   async checkPermissions(): Promise<void> {
    const locationAlert = await this.alertController.create({
      header: 'Problema con la ubicación',
      message: 'No se pudo obtener la ubicación del dispositivo. Por favor, habilita la ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
      buttons: ['OK'],
    });

    Geolocation.checkPermissions().then((result) => {
      if(result.location !== 'granted') {
        this.requestPermissions(locationAlert)
      }
      this.getLocation();
    }).catch((err) => {
      locationAlert.present();
    })
  }

  private async requestPermissions(locationAlert: HTMLIonAlertElement): Promise<void> {
    const permissionAlert = await this.alertController.create({
      header: 'Problema con los permisos',
      message: 'No se pudo obtener los permisos de ubicación del dispositivo. Por favor, habilita los permisos de ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
      buttons: ['OK'],
    });

    Geolocation.requestPermissions().then(async (result) => {
      if(result.location !== 'granted') {
        permissionAlert.present();
      }
      this.getLocation();
    },
    async (err) => {
      permissionAlert.present();
    }
    ).catch((err) => {

    })
  } */

 /*  getLocation(): void {
    Geolocation.getCurrentPosition().then((position) => {
      this.form.position = position.coords.latitude + ',' + position.coords.longitude;
    })
  } */

  getTotalQuestions(): number {
    return this.detailedFormService.getTotalQuestions();
  }
}
