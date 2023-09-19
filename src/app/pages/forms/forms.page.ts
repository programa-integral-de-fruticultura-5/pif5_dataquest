import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormService } from 'src/app/services/form/form.service';
import { FormListComponent } from 'src/app/components/form-list/form-list.component';

@Component({
  selector: 'app-forms',
  templateUrl: 'forms.page.html',
  styleUrls: ['forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormListComponent ],
})
export class FormsPage {

  constructor(private formService: FormService) {}

  getForms() {
    return this.formService.getForms();
  }

}



