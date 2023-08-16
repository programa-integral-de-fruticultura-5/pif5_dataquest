import { Component } from '@angular/core';
import { AlertController, IonicModule, Platform } from '@ionic/angular';
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

  constructor(
    private formsService: FormService,
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
      this.router.navigate(['details/' + form.id]);
    }else {
      window.alert('Esta funcionalidad solo está disponible en dispositivos móviles');
      const alert = await this.alertController.create({
        header: 'Dispositivo no compatible',
        message: 'Esta funcionalidad solo está disponible en dispositivos móviles',
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



