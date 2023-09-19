import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Question } from 'src/app/models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionControlService {
  constructor(private fb: FormBuilder) {}

  public toFormGroup(questions: Question[]): FormGroup {
    const group: any = {};
    questions.forEach((question) => {
      group[question.id] = this.getFormControl(question);
    });

    return new FormGroup(group);
  }

  private getFormControl(
    question: Question
  ): FormControl | FormGroup | FormArray {
    if (question.required === 1) {
      return this.assignFormControls(question, true);
    } else {
      return this.assignFormControls(question, false);
    }
  }

  private generateFormArray(question: Question, required: boolean): FormArray {
    const formArray: FormArray = new FormArray([] as FormGroup[]);
    question.questionChildren.forEach((section) => {
      let group: { [key: string]: any } = {};
      section.forEach((child) => {
        group[child.id] = this.getFormControl(child);
      });
      formArray.push(new FormGroup(group, required ? this.requiredChildrenResponse() : null));
    })
    if (required)
      formArray.setValidators(this.requiredTableResponse());
    return formArray;
  }

  private assignFormControls(
    question: Question,
    required: boolean
  ): FormControl | FormGroup | FormArray {
    let type = question.type;

      if (type === 'Abierta') {
        return new FormControl(
          question.answers[0].value || '',
          required ? Validators.required : null
        );
      }

      if(type === 'Autocomplete' || type === 'Única respuesta' || type === 'Única respuesta con otro' || type === 'Única respuesta con select') {
        return new FormControl(
          question.answers.filter((answer) => answer.checked)[0]?.value || '',
          required ? Validators.required : null
        );
      }

      if (type === 'Múltiple respuesta' || type === 'Múltiple respuesta con otro') {
        return new FormGroup(
          this.generateFormGroup(question),
          required ? this.atLeastOneChecked() : null
        );
      }

      return this.generateFormArray(question, required);

  }

  private generateFormGroup(question: Question): any {
    const group: any = {};
    question.answers.forEach((answer) => {
      group[answer.id] = new FormControl(answer.checked);
    });
    return group;
  }

  private atLeastOneChecked(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (formGroup instanceof FormGroup) {
        const checkboxValues = Object.values(formGroup.value);

        if (checkboxValues.includes(true)) {
          return null; // At least one checkbox is checked, validation passes
        }
      }
      return { atLeastOneChecked: true }; // No checkboxes are checked, validation fails
    };
  }

  private requiredChildrenResponse(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if (formGroup instanceof FormGroup) {
        const invalidControls = Object.keys(formGroup.controls).filter((key) => !formGroup.controls[key].valid);

        if (invalidControls.length > 0) {
          return { requiredChildrenResponse: true };
        }
      }
      return null;
    };
  }

  private requiredTableResponse(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        for (const formGroup of formArray.controls) {
          if (formGroup instanceof FormGroup && !formGroup.valid) {
            return { requiredTableResponse: true };
          }
        }
      }
      return null;
    };
  }
}
