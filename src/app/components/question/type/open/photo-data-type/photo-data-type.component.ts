import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { PhotoService } from 'src/app/services/detailed-form/question/photo/photo.service';

@Component({
  selector: 'app-photo-data-type',
  templateUrl: './photo-data-type.component.html',
  styleUrls: ['./photo-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule ],
})
export class PhotoDataTypeComponent  implements OnInit {

  @Input({ required: true }) question!: Question
  @Input({ required: true }) formGroup!: FormGroup

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
