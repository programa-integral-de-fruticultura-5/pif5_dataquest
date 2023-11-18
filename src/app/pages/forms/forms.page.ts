import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormService } from '@services/form/form.service';
import { FormListComponent } from '@components/form-list/form-list.component';
import { FormDetail } from '@models/FormDetail.namespace';

@Component({
  selector: 'app-forms',
  templateUrl: 'forms.page.html',
  styleUrls: ['forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormListComponent],
})
export class FormsPage {
  forms!: FormDetail.Form[];

  constructor(private formService: FormService) {}

  loadForms() {
    this.formService.getForms().subscribe((forms) => {
      this.forms = forms;
    });
  }
}
