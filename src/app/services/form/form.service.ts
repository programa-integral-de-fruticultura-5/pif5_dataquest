import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { Form } from 'src/app/models/form';

const ENDPOINT = 'form-detail';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private apiService: ApiService
  ) { }

  public getForms(): Observable<Form[]> {
    return this.apiService.post(ENDPOINT);
  }

}
