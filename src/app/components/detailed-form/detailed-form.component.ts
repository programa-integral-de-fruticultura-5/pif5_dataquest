import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-detailed-form',
  templateUrl: './detailed-form.component.html',
  styleUrls: ['./detailed-form.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule ],
})
export class DetailedFormComponent {

  form = this.formService.getForm();

  constructor(private formService: FormService) { }

}
