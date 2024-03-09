import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { PhotoService } from '@services/detailed-form/question/photo/photo.service';

@Component({
  selector: 'app-photo-data-type',
  templateUrl: './photo-data-type.component.html',
  styleUrls: ['./photo-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PhotoDataTypeComponent implements OnInit {
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  private currentForm!: FormDetail.Form;

  constructor(
    private photoService: PhotoService,
    private detailedFormService: DetailedFormService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.currentForm = this.detailedFormService.getForm();
  }

  async takePhoto() {
    const questionFormControl: FormControl = this.getFormControl();
    const photo: Photo = await this.photoService.takePhoto();
    questionFormControl.setValue(photo.base64String);
    this.savePhoto(photo);
  }

  private getFormControl(): FormControl {
    const questionId: string = this.question.id;
    return this.formGroup.get(questionId) as FormControl;
  }

  getPhoto(): string {
    const questionFormControl: FormControl = this.getFormControl();
    const photoAsBase64: string = questionFormControl.value;
    return photoAsBase64 === '' ? DEFAULT_PHOTO : PHOTO_PREFIX + photoAsBase64;
  }

  private async savePhoto(photo: Photo): Promise<void> {
    const createdPath: string = this.createPhotoPath();
    const photoAsBase64: string = photo.base64String!;

    try {
      await this.photoService.savePhoto(createdPath, PHOTO_PREFIX + photoAsBase64);
    } catch (error) {
      console.error('Error saving photo', error);
      this.presentToast(SAVE_PHOTO_ERROR);
    }
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  private createPhotoPath(): string {
    const currentFormId = this.currentForm.id;
    const currentFormBeneficiaryName = `${this.currentForm.beneficiary.firstname}-${this.currentForm.beneficiary.lastname}`;
    const currentFormTimestamp = this.currentForm.fechaInicial;
    const currentQuestionId: string = this.question.id;
    const newPath = `borradores/${currentFormId}-${currentFormBeneficiaryName}-${currentFormTimestamp}/${currentFormId}-${currentQuestionId}-${currentFormBeneficiaryName}-${currentFormTimestamp}.jpeg`;
    return newPath;
  }
}

const DEFAULT_PHOTO: string = 'assets/imgs/dataquest-icon-2732px.png';
const PHOTO_PREFIX: string = 'data:image/jpeg;base64,';
const SAVE_PHOTO_ERROR: string = 'Error guardando la foto';
