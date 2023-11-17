import { Injectable } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { FormDetail } from '@models/FormDetail.namespace';
import { HttpResponse } from '@capacitor/core';
import { StorageService } from '../storage/storage.service';
import { Network } from '@capacitor/network';

const ENDPOINT = 'form-detail';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private forms: FormDetail.Form[];

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.forms = [];
    this.requestForms();
    this.enableListner();
  }

  private enableListner() {
    Network.addListener('networkStatusChange', (status) => {
      let connectionType = status.connectionType;
      if (connectionType === 'wifi' || connectionType === 'cellular') {
        this.requestForms();
      }
    });
  }

  public async requestForms(): Promise<void> {
    const { connected } = await Network.getStatus();
    if (connected) {
      this.getLocalForms();
      this.getRemoteForms();
    } else {
      this.getLocalForms();
    }
  }

  private getLocalForms(): void {
    this.storageService.get('forms')?.then((forms) => {
      if (forms) {
        this.forms = forms;
      }
    });
  }

  private setLocalForms(): void {
    this.storageService.set('forms', this.forms);
  }

  private getRemoteForms(): void {
    var response: Promise<HttpResponse> = this.apiService.post(ENDPOINT);

    response.then(
      (formsResponse: HttpResponse) => {
        const forms: FormDetail.Form[] = JSON.parse(formsResponse.data);
        this.processForms(forms);
        this.setLocalForms();
      },
      (err) => {
        throw new Error(err);
      }
    );
  }

  private processForms(forms: FormDetail.Form[]): void {
    // Iterate through each form and initialize questionChildren arrays
    forms.forEach((form: FormDetail.Form) => {
      let foundForm: FormDetail.Form | undefined = this.forms.find(
        (f: FormDetail.Form) => f.id === form.id
      );
      if (!foundForm) {
        form.questions.forEach((question: FormDetail.Question) => {
          if (question.type === 'Tabla') {
            let children: FormDetail.Question[][] = this.getQuestionChildren(
              question,
              form
            );
            question.questionChildren = children;
          }
        });

        const currentDate: Date = new Date();
        form.fechaDescarga = currentDate.toISOString(); // Convert Date to string
        this.forms.push(form);
      }
    });
  }

  private getQuestionChildren(question: FormDetail.Question, form: FormDetail.Form): FormDetail.Question[][] {
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

  public getForms(): FormDetail.Form[] {
    return this.forms.filter((form: FormDetail.Form) => {
      const dateInit: Date = new Date(form.dateInit);
      const dateEnd: Date = new Date(form.dateEnd);
      const today: Date = new Date();

      return dateInit <= today && dateEnd >= today;
    });
  }
}
