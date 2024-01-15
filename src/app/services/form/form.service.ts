import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { HttpResponse } from '@capacitor/core';
import { StorageService } from '../storage/storage.service';
import { Network } from '@capacitor/network';
import { Observable, from } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { formBuilder } from '@utils/builder';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  public getForms(): Observable<FormDetail.Form[]> {
    return from(Network.getStatus()).pipe(
      switchMap((status) => {
        if (!status.connected) {
          return this.getLocalForms();
        } else {
          return from(this.apiService.post(ENDPOINT)).pipe(
            map((response: HttpResponse) => {
              const formsResponse: FormDetail.FormResponse[] = JSON.parse(
                response.data
              );
              const currentDate: Date = new Date();
              var forms: FormDetail.Form[] = formsResponse.map(
                (form: FormDetail.FormResponse) => {
                  const builtForm: FormDetail.Form = formBuilder(form);
                  builtForm.questions.forEach((question) => {
                    if (question.type === 'Tabla') {
                      let children: FormDetail.Question[][] =
                        this.getQuestionChildren(question, builtForm);
                      question.questionChildren = children;
                    }
                  });
                  builtForm.fechaDescarga = currentDate.toISOString(); // Convert Date to string

                  return builtForm;
                }
              );
              forms = forms.filter((form) => {
                const initialDate: Date = new Date(form.dateInit);
                const finalDate: Date = new Date(form.dateEnd);
                return currentDate >= initialDate && currentDate <= finalDate;
              })
              return forms;
            }),
            tap((forms: FormDetail.Form[]) => {
              this.setLocalForms(forms);
            })
          );
        }
      })
    );
  }

  private getQuestionChildren(
    question: FormDetail.Question,
    form: FormDetail.Form
  ): FormDetail.Question[][] {
    let children: FormDetail.Question[][] = [];
    let base: FormDetail.Question[] = [];

    // Iterate through each question of the form
    form.questions.forEach((q: FormDetail.Question) => {
      // If the question is a child of the current question
      if (q.questionParentId === question.id) {
        // Add the question to the base array
        base.push(q);
      }
    });

    // Add the base array to the children array
    children.push(base);

    return children;
  }

  private getLocalForms(): Promise<FormDetail.Form[]> {
    return this.storageService.get(FORMS_STORAGE_KEY);
  }

  private setLocalForms(forms: FormDetail.Form[]): void {
    this.storageService.set(FORMS_STORAGE_KEY, forms);
  }
}

const FORMS_STORAGE_KEY = 'forms';
const ENDPOINT = 'form-detail';
