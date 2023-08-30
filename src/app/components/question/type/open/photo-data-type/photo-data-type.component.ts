import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from 'src/app/services/detailed-form/question/photo/photo.service';

@Component({
  selector: 'app-photo-data-type',
  templateUrl: './photo-data-type.component.html',
  styleUrls: ['./photo-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule ],
})
export class PhotoDataTypeComponent  implements OnInit {

  constructor(private photoService: PhotoService) { }

  ngOnInit() {}

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

}
