import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'
import { PhotoService } from '@services/detailed-form/question/photo/photo.service';

@Component({
  selector: 'app-photo-data-type',
  templateUrl: './photo-data-type.component.html',
  styleUrls: ['./photo-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule ],
})
export class PhotoDataTypeComponent  implements OnInit {

  @Input({ required: true }) question!: FormDetail.Question
  @Input({ required: true }) formGroup!: FormGroup
  @Input({ required: true }) disabled!: boolean

  constructor(private photoService: PhotoService) { }

  ngOnInit() { }

  takePhoto() {
    this.photoService.takePhoto().then((photo) => {
      this.formGroup.get(`${this.question.id}`)?.setValue(photo);
    })
  }

  getPhoto(): any {
    let photoBase64 = this.formGroup.get(`${this.question.id}`)?.value;
    let photo = `data:image/jpeg;base64,${photoBase64}`;
    return photo;
  }
}
