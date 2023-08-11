import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Form } from 'src/app/models/form';
import { HttpResponse } from '@capacitor/core';

const ENDPOINT = 'form-detail';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private form!: Form;

  constructor(
    private apiService: ApiService
  ) { }

  public getForms(): Promise<HttpResponse> {
    return this.apiService.post(ENDPOINT);
  }

  public setForm(newForm: Form): void {
    this.form = newForm;
  }

  public getForm(): Form | undefined {
    return this.form;
  }
}
