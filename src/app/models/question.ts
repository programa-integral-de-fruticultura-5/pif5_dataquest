import { Answer } from "./answer";

export class Question {
  constructor(
    public id: number,
    public text: string,
    public type: string,
    public required: number,
    public dataType: string,
    public order: number,
    public answerLength: number,
    public isExtendable: boolean,
    public questionParentId: number,
    public answers: Array<Answer>,
    public answerRelation: Array<{ type: string, questionId: number, anserId: number }>,
    public questionChildren: Array<Question>,
    public value: string,
    public values: Array<string>,
    public min?: number,
    public max?: number
  ) {}
}
