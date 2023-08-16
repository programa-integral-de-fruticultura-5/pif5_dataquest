import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormService } from 'src/app/services/form/form.service';
import { Geolocation, Position } from '@capacitor/geolocation';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';

@Component({
  selector: 'app-detailed-form',
  templateUrl: './detailed-form.component.html',
  styleUrls: ['./detailed-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule ],
})
export class DetailedFormComponent {

  // form = this.formService.getForm();

  constructor(
    private detailedFormService: DetailedFormService
  ) { }

  ngOnInit() {

  }

  // TODO: check permissions, if equal to 'denied' or 'prompt' then ask for permissions; if equal to 'granted' then proceed to get location; if error then ask to enable location in an window alert

}
