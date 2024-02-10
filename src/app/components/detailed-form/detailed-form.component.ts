import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { QuestionComponent } from '@components/question/question.component';
import { DataquestHeaderComponent } from '@components/header/dataquest-header/dataquest-header.component';
import { LocationService } from '@services/location/location.service';
import { Position } from '@capacitor/geolocation';

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
    private locationService: LocationService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnDestroy() {
    this.detailedFormService.setQuestionsPage(false);
  }

  getForm(): FormDetail.Form {
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
    this.startDraft();
  }

  viewSurvey(): void {
    this.detailedFormService.setQuestionsPage(true);
  }

  resumeDraft(): void {
    this.detailedFormService.setQuestionsPage(true);
  }

  private getLocation(): void {
    this.locationService
      .getCurrentLocation()
      .then((position: Position | undefined) => {
        if (position) {
          console.log(position.coords);
          this.getForm().position = `Latitude:${position.coords.latitude},Longitude:${position.coords.longitude}`;
          this.getForm().altitud = position.coords.altitude ?? 0;
          console.log(
            `Position: ${this.getForm().position}, Altitude: ${
              position.coords.altitude
            }`
          );
          this.presentLocationToast(
            '¡Ubicación obtenida satisfactoriamente!',
            position
          );
        }
      });
  }

  private async presentLocationToast(message: string, position: Position) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom',
      icon: 'navigate-circle-outline',
      buttons: [
        {
          side: 'end',
          text: 'Más info',
          role: 'info',
          handler: () => {
            this.presentLocationAlert(position);
          },
        },
      ],
    });

    await toast.present();
  }

  private async presentLocationAlert(position: Position): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Coordenadas',
      message:
        'Latitud: ' +
        position.coords.latitude +
        ', longitud: ' +
        position.coords.longitude +
        ', altitud: ' +
        (position.coords.altitude ?? 0),
      buttons: ['OK'],
    });

    await alert.present();
  }

  /*   private async getLocation(): Promise<void> {
    try {
      // Check location permissions
      const permissions = await Geolocation.checkPermissions();

      if (permissions.location !== 'granted') {
        // Request permissions if not granted
        const permissionResult = await Geolocation.requestPermissions();
        if (permissionResult.location !== 'granted') {
          this.presentPermissionAlert();
          this.navController.pop();
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true, // Consider enabling for precision if needed
        timeout: 30000, // Set a timeout to prevent getting stuck
      }).catch((error) => {
        this.presentLocationAlert();
        this.navController.pop();}
      );

      if (position) {
        console.log(position.coords);
        this.getForm().position = `${position.coords.latitude},${position.coords.longitude}`;
        this.getForm().altitud = position.coords.altitude ?? 0;
        console.log(`Position: ${position.coords.latitude},${position.coords.longitude}, Altitude: ${this.getForm().altitud}`);
        this.startDraft();
      } else {
        this.presentLocationAlert();
        this.navController.pop();
      }
    } catch (error) {
      console.log('Error getting location: ', error);
      this.presentLocationAlert();
      this.navController.pop();
    }
  }

  private async presentPermissionAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message:
        'Por favor, habilita los permisos de ubicación en los ajustes del dispositivo.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  private async presentLocationAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'No se pudo obtener la ubicación',
      message:
        'Por favor, habilita la ubicación en los ajustes del dispositivo y vuelve a intentarlo.',
      buttons: ['OK'],
    });

    await alert.present();
  } */

  private startDraft(): void {
    this.detailedFormService.startDraft();
    this.detailedFormService.setQuestionsPage(true);
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
