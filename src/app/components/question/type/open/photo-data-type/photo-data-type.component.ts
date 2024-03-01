import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonicModule } from '@ionic/angular';
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
  private path: string = DEFAULT_PHOTO;
  private photoAsBase64: string = DEFAULT_PHOTO;

  constructor(
    private photoService: PhotoService,
    private detailedFormService: DetailedFormService
  ) {}

  async ngOnInit() {
    this.currentForm = this.detailedFormService.getForm();
    await this.setNewPath();
  }

  async ngOnChanges (simpleChanges: SimpleChanges) {
    const currentValue: FormDetail.Question = simpleChanges['question'].currentValue;
    const previousValue: FormDetail.Question = simpleChanges['question'].previousValue;
    if (currentValue !== previousValue) {
      await this.setNewPath();
    }
  }

  private async setNewPath(): Promise<void> {
    const newPath: string | undefined = await this.getAbsolutePhotoPath();
    if (newPath) {
      this.path = newPath;
      this.photoAsBase64 = await this.convertToBase64(newPath);
    } else {
      this.path = DEFAULT_PHOTO;
      this.photoAsBase64 = DEFAULT_PHOTO;
    }
  }

  async takePhoto() {
    const photo: Photo = await this.photoService.takePhoto();
    this.savePhoto(photo);
    this.photoAsBase64 = await this.convertToBase64(photo.path!);
  }

  getPhoto(): string {
    return this.photoAsBase64;
  }

  private async savePhoto(photo: Photo): Promise<void> {
    const createdPath: string = this.createPhotoPath();
    const newAbsolutePath: string | undefined =
      await this.photoService.savePhoto(photo.path!, createdPath);
    if (newAbsolutePath) {
      this.path = newAbsolutePath;
      const photoAsBase64 = await this.readAsBase64(newAbsolutePath);
      if (photoAsBase64) {
        this.formGroup.get(`${this.question.id}`)?.setValue(photoAsBase64);
      } else {
        this.formGroup.get(`${this.question.id}`)?.setValue('');
      }
    }
  }

  private async readAsBase64(photoPath: string): Promise<string | undefined> {
    return await this.photoService.readPhoto(photoPath);
  }

  private createPhotoPath(): string {
    const currentFormId = this.currentForm.id;
    const currentFormBeneficiaryName = `${this.currentForm.beneficiary.firstname}-${this.currentForm.beneficiary.lastname}`;
    const currentFormTimestamp = this.currentForm.fechaInicial;
    const currentQuestionId: string = this.question.id;
    const newPath = `borradores/${currentFormId}-${currentFormBeneficiaryName}-${currentFormTimestamp}/${currentFormId}-${currentQuestionId}-${currentFormBeneficiaryName}-${currentFormTimestamp}.jpg`;
    return newPath;
  }

  private async getAbsolutePhotoPath(): Promise<string | undefined> {
    var folder: string = this.detailedFormService.isDraft()
      ? 'borradores'
      : 'encuestas';
    const currentFormId = this.currentForm.id;
    const currentFormBeneficiaryName = `${this.currentForm.beneficiary.firstname}-${this.currentForm.beneficiary.lastname}`;
    const currentFormTimestamp = this.currentForm.fechaInicial;
    const currentQuestionId: string = this.question.id;
    const photoFolder = `${folder}/${currentFormId}-${currentFormBeneficiaryName}-${currentFormTimestamp}`;
    const photoName: string = `${currentFormId}-${currentQuestionId}-${currentFormBeneficiaryName}-${currentFormTimestamp}.jpg`;
    return await this.photoService.getPhotoAbsolutePath(photoFolder, photoName)
  }

  private async convertToBase64(paht: string): Promise<string> {
    const photoAsBase64: string | undefined = await this.readAsBase64(paht);
    const photoAsBase64WithPrefix: string = `data:image/jpeg;base64,${photoAsBase64}`;
    return photoAsBase64 ? photoAsBase64WithPrefix : DEFAULT_PHOTO;
  }
}

const DEFAULT_PHOTO: string = 'assets/imgs/dataquest-icon-2732px.png';
