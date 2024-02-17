import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { HttpResponse } from '@capacitor/core';
import { StorageService } from '../storage/storage.service';
import { Network } from '@capacitor/network';
import { Observable, from } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { formBuilder } from '@utils/builder';

/**
 * Service for managing the forms.
 * Local and remote forms are handled here
 */
@Injectable({
  providedIn: 'root',
})
export class FormService {

  /**
   * Constructor. Dependencies are injected here
   * @param apiService For making requests to the server
   * @param storageService For saving and retrieving forms from the local storage
   */
  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  /**
   * Retrieves the forms from the server or local storage based on network connectivity.
   * If the device is offline, it retrieves the forms from local storage.
   * If the device is online, it makes a POST request to the server to fetch the forms.
   * The forms are then processed and filtered based on the current date.
   * Finally, the forms are stored in local storage and returned as an Observable.
   *
   * @returns An Observable of FormDetail.Form[] representing the retrieved forms.
   */
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
                  builtForm.questions = builtForm.questions.filter(
                    (question) => question.questionParentId === null || question.questionParentId === undefined
                  );
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

  /**
   * Retrieves the children questions of a
   * given question in a form only when its
   * type is "Tabla".
   *
   * @param question - The parent question.
   * @param form - The form containing the questions.
   * @returns An array of arrays of questions representing the children questions.
   */
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

  /**
   * Retrieves the local forms from the storage service.
   * @returns A promise that resolves to an array of FormDetail.Form type.
   */
  private getLocalForms(): Promise<FormDetail.Form[]> {
    return this.storageService.get(FORMS_STORAGE_KEY);
  }

  /**
   * Sets the local forms in the storage.
   *
   * @param forms - The forms to be stored locally.
   */
  private setLocalForms(forms: FormDetail.Form[]): void {
    this.storageService.set(FORMS_STORAGE_KEY, forms);
  }
}

/**
 * The key used to store forms in local storage.
 */
const FORMS_STORAGE_KEY = 'forms';
/**
 * The endpoint for form details.
 */
const ENDPOINT = 'form-detail';
