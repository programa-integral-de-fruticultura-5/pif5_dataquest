import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Form } from 'src/app/models/form';
import { HttpResponse } from '@capacitor/core';

const ENDPOINT = 'form-detail';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private forms: Form[];

  constructor(
    private apiService: ApiService
  ) {
    this.forms = [];
  }

  public sendRequest(): void {
    var response: Promise<HttpResponse> = this.apiService.post(ENDPOINT);

    response.then(
      (forms) => {
        this.forms = JSON.parse(forms.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getForms(): Form[] {
    return this.forms.filter((form) => !form.draft)
  }

}
