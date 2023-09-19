import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Form } from 'src/app/models/form';
import { HttpResponse } from '@capacitor/core';
import { Question } from 'src/app/models/question';

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
      (formsResponse) => {
        const forms = JSON.parse(formsResponse.data);

        // Iterate through each form and initialize questionChildren arrays
        forms.forEach((form: Form) => {

          let foundForm: Form | undefined = this.forms.find((f: Form) => f.id === form.id)
          if (!foundForm) {
            form.draft = false;

            form.questions.forEach((question: Question) => {
              if (question.type === 'Tabla') {
                let children: Question[][] = this.getQuestionChildren(question, form);
                question.questionChildren = children;
              }
            })

            this.forms.push(form);
          }
        })
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private getQuestionChildren(question: Question, form: Form): Question[][] {
    let children: Question[][] = [];
    let base: Question[] = [];

    // Iterate through each question of the form
    form.questions.forEach((q: Question) => {
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

  public getForms(): Form[] {
    return this.forms.filter((form) => !form.draft)
  }

  public getDrafts(): Form[] {
    return this.forms.filter((form) => form.draft)
  }

}
