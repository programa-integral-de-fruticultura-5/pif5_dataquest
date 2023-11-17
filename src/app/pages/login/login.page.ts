import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';
import { FormService } from '@services/form/form.service';
import { AssociationService } from '@services/association/association.service';
import { ProducerService } from '@services/producer/producer.service';
import { HttpResponse } from '@capacitor/core';
import { AuthResponse } from '@types/authResponse';
import { UserResponse } from '@types/userResponse';

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
        async (res: HttpResponse) => {
          const status = res.status;
          const authResponse: AuthResponse = res.data;
          const userResponse: UserResponse = authResponse.user;
          if (status === 200) {
            await this.loadingController.dismiss();
            this.auth.saveToken(authResponse.token);
            this.auth.saveUser(userResponse);
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
        }
      ).catch( async (err) => {
        await this.loadingController.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo iniciar sesión, por favor, verifique su conexión a internet e intente nuevamente',
          buttons: ['OK'],
        });
        await alert.present();
      });
    } else {
      await this.loadingController.dismiss();
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingrese un email y una contraseña válidos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  private requestData(): void {
    this.requestForms();
    this.requestProducers();
    this.requestAssociations();
  }

  private requestForms(): void {
    this.formService.requestForms();
  }

  private requestProducers(): void {
    this.producerService.requestProducers();
  }

  private requestAssociations(): void {
    this.associationService.requestAssociations();
  }
}
