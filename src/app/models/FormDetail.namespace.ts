import { Beneficiary } from "./Beneficiary.namespace";

export namespace FormDetail {
  export interface Form {
    id: number,
    uuid: string,
    name: string,
    fechaDescarga: string,
    fechaInicial: string,
    fechaUltimoCambio: string,
    fechaCarga: string,
    sync: boolean,
    position: string,
    altitud: number,
    dateInit: string,
    dateEnd: string,
    fatherId: any,
    fatherName: string,
    questions: Array<Question>,
    description: string,
    beneficiary: Beneficiary.Producer,
    metadataId: number
  }

  export interface FormManagement {
    getQuestion(question: Question, form: Form): Question[][];
  }

  export type FormResponse = {
    id: number,
    name: string,
    description: string,
    dateInit: string,
    dateEnd: string,
    projectID: number,
    questions: Array<QuestionResponse>,
    pivot: Pivot,
  }

  export type Pivot = {
    user_id: number,
    form_id: number,
  }

  export interface Question {
    id: number,
    text: string,
    type: string,
    required: number,
    dataType: string,
    order: number,
    answerLength: number,
    extendable: boolean,
    questionParentId: number,
    answers: Array<Answer>,
    questionCategory: QuestionCategory,
    answersRelation: Array<AnswerRelation>,
    questionChildren: Array<Array<Question>>,
    userTypeRestriction: string,
    min?: number,
    max?: number
  }

  export type QuestionResponse = {
    id: number,
    type: string,
    required: number,
    dataType: string,
    text: string,
    order: number,
    extends: number,
    min: number,
    max: number,
    user_type_restriction: string,
    questionParentId: number,
    formID: number,
    question_category_id: number,
    answers: Array<AnswerResponse>,
    answers_relation: Array<AnswerRelationResponse>,
    question_category: QuestionCategoryResponse,
  }

  export interface QuestionCategory {
    id: number,
    name: string,
  }

  export type QuestionCategoryResponse = QuestionCategory

  export interface Answer {
    id: number,
    order: number,
    questionId: number,
    checked: boolean,
    value: string,
  }

  export type AnswerResponse = {
    id: number,
    order: number,
    question_id: number,
    value: string,
  }

  export interface AnswerRelation {
    id: number,
    questionId: number,
    answerPivot: AnswerPivot,
  }

  export type AnswerRelationResponse = {
    id: number,
    question_id: number,
    pivot: AnswerPivotResponse,
  }

  export interface AnswerPivot {
    questionId: number,
    answerId: number,
    type: string,
  }

  export type AnswerPivotResponse = {
    question_id: number,
    answer_id: number,
    type: string,
  }
}
