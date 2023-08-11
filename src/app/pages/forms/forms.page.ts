import { Component, Inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Form } from 'src/app/models/form';
import { FormService } from 'src/app/services/form/form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forms',
  templateUrl: 'forms.page.html',
  styleUrls: ['forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule ],
})
export class FormsPage {

  private forms: Form[] = [];

  constructor(private formsService: FormService, private router: Router) {}

  ngOnInit() {
    this.callOneForm();
  }

  getForms() {
    return this.forms;
  }

  navigate(form: Form) {
    this.formsService.setForm(form);
    this.router.navigate(['tabs/details']);

  }

  openModal() {
    console.log('openModal()');
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.callForms()
      event.target.complete();
    }, 2000);
  }

  callOneForm (): void {
    this.formsService.getForms().then(
      (forms) => {
        this.forms.push(forms.data[0]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  callForms (): void {
    this.formsService.getForms().then(
      (forms) => {
        this.forms = forms.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}



