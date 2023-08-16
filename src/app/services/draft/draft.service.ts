import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { FormService } from '../form/form.service';

@Injectable({
  providedIn: 'root'
})
export class DraftService {

  private drafts: Form[];

  constructor(private formService: FormService) {
    this.drafts = [];
  }

  public getDrafts(): Form[] {
    return this.drafts.filter((draft) => draft.draft);
  }

}
