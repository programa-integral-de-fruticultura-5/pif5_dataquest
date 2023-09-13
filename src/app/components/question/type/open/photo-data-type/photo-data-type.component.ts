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

  ngOnInit() {}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

}
