import { Component } from '@angular/core';
import { AlertController, IonicModule, Platform, ToastController } from '@ionic/angular';
import { DraftService } from '@services/draft/draft.service';
import { Router } from '@angular/router';
import { FormDetail } from '@models/FormDetail.namespace';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drafts',
  templateUrl: 'drafts.page.html',
  styleUrls: ['drafts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DraftsPage {
  constructor(
    private platform: Platform,
    private detailedFormService: DetailedFormService,
    private router: Router,
    private draftService: DraftService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.draftService.getLocalDrafts();
  }

  getDrafts() {
    return this.draftService.getDrafts();
  }

  async deleteDraft(index: number) {
    const deletionAlert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Esta acción no se puede deshacer',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            this.draftService.deleteDraft(index);
            const deletedToast = await this.toastController.create({
              message: 'Borrador eliminado exitosamente',
              duration: 2000,
            });
            await deletedToast.present();
          },
        },
      ],
    });
    await deletionAlert.present();
  }

  async goToDetail(formToSend: FormDetail.Form) {
    if (this.platform.is('mobile')) {
      this.detailedFormService.setForm(formToSend, false, true, false);
      this.router.navigate(['detail']);
    } else {
      const alert = await this.alertController.create({
        header: 'Dispositivo no compatible',
        message:
          'Para acceder al formulario, ingresa desde un dispositivo móvil',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
