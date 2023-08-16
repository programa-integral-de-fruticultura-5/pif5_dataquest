import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { FormService } from '../form/form.service';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class DetailedFormService {

  private selectedForm!: Form;
  private permissions!: string;

  constructor(private formService: FormService) { }

  public getForm(): Form {
    return this.selectedForm;
  }

  public setForm(form: Form): void {
    this.selectedForm = form;
  }

  public getLocation(): void {
    this.permissions = this.checkPermissions();
    if (this.permissions === 'denied' || this.permissions === 'prompt') {
      this.requestPermissions();
    } else if (this.permissions === 'granted') {
      this.getCurrentPosition();
    }
  }

  private getCurrentPosition(): void {
    Geolocation.getCurrentPosition().then((result) => {
      const latitude = result.coords.latitude;
      const longitude = result.coords.longitude;

      this.selectedForm.position = "Latitud: " + latitude + ', Logitud: ' + longitude;
    })
  }

  private checkPermissions(): string {
    let permissions: string = 'denied';
    Geolocation.checkPermissions().then((result) => {
      permissions = result.location;
    })
    return permissions;
  }

  private requestPermissions(): void {
    Geolocation.requestPermissions().then((result) => {
      if (result.location === 'denied' || result.location === 'prompt') {
        this.requestPermissions();
      } else if (result.location === 'granted') {
        this.getCurrentPosition();
      }
    })
  }
}
