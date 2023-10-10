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
  constructor() {}

  public toFormGroup(questions: Question[]): FormGroup {
    const group: { [key: string]: FormControl | FormGroup | FormArray } = {};
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

  private assignFormControls(
    question: Question,
    required: boolean
  ): FormControl | FormArray | FormGroup {
    switch (question.type) {
      case 'Abierta':
        return this.generateFormControl(question, required);
      case 'Tabla':
        return this.generateFormArray(question, required);
      default:
        return this.generateFormGroup(question, required);
    }
  }

  private generateFormControl(
    question: Question,
    required: boolean
  ): FormControl | FormGroup {
    if (question.dataType === 'tel') {
      const group: { [key: string]: FormControl } = {};
      question.answers.forEach((answer) => {
        group[answer.order] = new FormControl(answer.value, [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]);
      });
      const formGroup: FormGroup = new FormGroup(
        group,
        required ? this.requiredChildrenResponse() : null
      );
      return formGroup;
    }
    return new FormControl(
      question.answers[0].value || '',
      required ? Validators.required : null
    );
  }

  private generateFormGroup(question: Question, required: boolean): any {
    const group: { [key: string]: FormControl } = {};
    question.answers.forEach((answer) => {
      group[answer.id] = new FormControl(answer.checked);
    });

    const formGroup: FormGroup = new FormGroup(
      group,
      required ? this.atLeastOneChecked() : null
    );

    if (
      question.type === 'Múltiple respuesta con otro' ||
      question.type === 'Única respuesta con otro'
    ) {
      let value: string =
        question.answers[question.answers.length - 1].value.split(':')[1] || '';
      formGroup.addControl(
        'other',
        new FormControl(value, Validators.required)
      );
    }
    return formGroup;
  }

  private generateFormArray(question: Question, required: boolean): FormArray {
    const array: FormGroup[] = [];
    question.questionChildren.forEach((section) => {
      const group: { [key: string]: FormControl | FormGroup | FormArray } = {};
      section.forEach((child) => {
        group[child.id] = this.getFormControl(child);
      });

      const formGroup: FormGroup = new FormGroup(
        group,
        required ? this.requiredChildrenResponse() : null
      );

      array.push(formGroup);
    });

    const formArray: FormArray = new FormArray(
      array,
      required ? this.requiredTableResponse() : null
    );

    return formArray;
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
        const invalidControls = Object.keys(formGroup.controls).filter(
          (key) => formGroup.controls[key].invalid
        );

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
