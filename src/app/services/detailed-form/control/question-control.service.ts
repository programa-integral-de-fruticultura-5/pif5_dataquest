import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Question } from 'src/app/models/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionControlService {
  constructor() {}

  public toFormGroup(questions: Question[]): FormGroup {
    const group: any = {};
    console.log('Question control service');
    questions.forEach((question) => {
      console.log(question);
      group[question.id] = this.getFormControl(question);
    });

    return new FormGroup(group);
  }

  private getFormControl(question: Question): FormControl | FormGroup {
    if (question.required === 1) {
      return this.assignFormControls(question, true);
    } else {
      return this.assignFormControls(question, false);
    }
  }

  private generateControlArray(question: Question): FormControl[] {
    let array: FormControl[] = [];
    array = question.answers
      .filter((answer) => answer.checked)
      .map((answer) => new FormControl(answer.value));
    return array;
  }

  private assignFormControls(
    question: Question,
    required: boolean
  ): FormControl | FormGroup {
    switch (question.type) {
      case 'Abierta':
        return new FormControl(
          question.answers[0].value || '',
          required ? Validators.required : null
        );
      case 'Única respuesta' || 'Autocomplete':
        return new FormControl(
          question.answers.filter((answer) => answer.checked)[0]?.value || '',
          required ? Validators.required : null
        );
      case 'Múltiple respuesta':
        return new FormGroup(
          this.generateFormGroup(question),
          required ? this.atLeastOneChecked() : null
        );
      default:
        return new FormControl('', required ? Validators.required : null);
    }
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

}

