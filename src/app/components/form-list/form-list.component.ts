import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController, IonicModule, ToastController } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace';
import { DetailedFormService } from '@services/detailed-form/detailed-form.service';
import { DraftService } from '@services/draft/draft.service';
import { FormService } from '@services/form/form.service';
import { SurveyService } from '@services/survey/survey.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class FormListComponent {

  @Input({ required: true }) forms!: FormDetail.Form[];
  @Input({ transform: booleanAttribute }) form: boolean = false;
  @Input({ transform: booleanAttribute }) draft: boolean = false;
  @Input({ transform: booleanAttribute }) survey: boolean = false;

  constructor(
    private formsService: FormService,
    private draftService: DraftService,
    private surveyService: SurveyService,
    private detailedFormService: DetailedFormService,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.requestData();
  }

  async navigate(formToSend: FormDetail.Form) {
    if (this.platform.is('mobile')) {
      this.detailedFormService.setForm(formToSend, this.form, this.draft, this.survey);
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

  handleRefresh(event: any) {
    setTimeout(() => {
      this.requestData()
      event.target.complete();
    }, 2000);
  }

  private requestData() {
    if (this.form) {
      this.formsService.getForms().subscribe((forms) => {
        this.forms = forms;
      });
    }
    if (this.draft) {
      this.draftService.loadDrafts();
    }
  }
}
