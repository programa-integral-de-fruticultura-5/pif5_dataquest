import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormService } from 'src/app/services/form/form.service';
import { AssociationService } from 'src/app/services/association/association.service';
import { ProducerService } from 'src/app/services/producer/producer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private formService: FormService,
    private producerService: ProducerService,
    private associationService: AssociationService
  ) { }

  form: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() {
  }

  async login () {
    const loading = await this.loadingController.create(
      {
        message: 'Cargando...',
      }
    );
		await loading.present();

    if (this.form.valid) {
      this.auth.login(this.form.value).then(
        async (res) => {
          if (res.status === 200) {
            await this.loadingController.dismiss();
            this.auth.saveToken(res.data.token);
            this.router.navigate(['/home']);
            this.requestData();
          } else {
            await this.loadingController.dismiss();
            const alert = await this.alertController.create({
              header: 'Error',
              message: res.data.error,
              buttons: ['OK'],
            });
            await alert.present();
          }
        }).catch(
        async (err) => {
          await this.loadingController.dismiss();
          const alert = await this.alertController.create({
            header: 'Error',
            message: err.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    }
  }

  private requestData(): void {
    this.requestForms();
    this.requestProducers();
    this.requestAssociations();
  }

  private requestForms(): void {
    this.formService.sendRequest();
  }

  private requestProducers(): void {
    this.producerService.sendRequest();
  }

  private requestAssociations(): void {
    this.associationService.sendRequest();
  }
}
