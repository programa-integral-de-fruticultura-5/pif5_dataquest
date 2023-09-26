import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, AlertController, IonicModule } from '@ionic/angular';
import { Form } from 'src/app/models/form';
import { AssociationService } from 'src/app/services/association/association.service';
import { DetailedFormService } from 'src/app/services/detailed-form/detailed-form.service';
import { DraftService } from 'src/app/services/draft/draft.service';
import { FormService } from 'src/app/services/form/form.service';
import { ProducerService } from 'src/app/services/producer/producer.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class FormListComponent implements OnInit {

  @Input({ required: true }) forms!: Form[];
  @Input({ transform: booleanAttribute }) showId: boolean = false;

  constructor(
    private formsService: FormService,
    private draftService: DraftService,
    private producersService: ProducerService,
    private associationService: AssociationService,
    private detailedFormService: DetailedFormService,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.requestData();
  }

  async navigate(form: Form) {
    if (this.platform.is('mobile')) {
      this.detailedFormService.setForm(form);
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

  handleRefresh(event: any) {
    setTimeout(() => {
      this.requestData
      event.target.complete();
    }, 2000);
  }

  private requestData() {
    this.formsService.requestForms();
    this.draftService.loadDrafts();
    this.producersService.sendRequest();
    this.associationService.sendRequest();
  }
}
