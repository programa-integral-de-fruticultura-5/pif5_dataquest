import { Component } from '@angular/core';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Form } from 'src/app/models/form';
import { FormService } from 'src/app/services/form/form.service';
import { Router } from '@angular/router';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';

@Component({
  selector: 'app-forms',
  templateUrl: 'forms.page.html',
  styleUrls: ['forms.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule ],
})
export class FormsPage {

  constructor(
    private formsService: FormService,
    private detailedFormService: DetailedFormService,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.formsService.sendRequest();
  }

  getForms(): Form[] {
    return this.formsService.getForms();
  }

  async navigate(form: Form) {
    if(this.platform.is('mobile')) {
      this.detailedFormService.setForm(form);
      this.router.navigate(['details']);
    }else {
      const alert = await this.alertController.create({
        header: 'Dispositivo no compatible',
        message: 'Para acceder al formulario, ingresa desde un dispositivo móvil',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.formsService.sendRequest();
      event.target.complete();
    }, 2000);
  }
}



