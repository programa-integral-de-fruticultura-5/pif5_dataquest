import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  form: FormGroup = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() {}

  async login() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    if (this.form.valid) {
      try {
        await this.authService.login(this.form.value);
        await this.loadingController.dismiss();
      } catch (error: any) {
        await this.loadingController.dismiss();
        const message = error.message
        const alert = await this.alertController.create({
          header: 'Error',
          message: message || 'Ha ocurrido un error inesperado',
          buttons: ['OK'],
        });
        await alert.present();
      }
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
}
