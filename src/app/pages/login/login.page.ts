import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
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
            console.log(res);
            this.auth.saveToken(res.data.token);
            this.router.navigate(['/tabs']);
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
      )
    }
  }
}
