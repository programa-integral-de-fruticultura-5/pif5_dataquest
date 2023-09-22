import { Answer } from './answer';
import { AnswerRelation } from './answerRelation';
import { QuestionCategory } from './questionCategory';

export class Question {
  constructor(
    public id: number,
    public text: string,
    public type: string,
    public required: number,
    public dataType: string,
    public order: number,
    public answerLength: number,
    public extendable: boolean,
    public questionParentId: number,
    public answers: Array<Answer>,
    public question_category: QuestionCategory,
    public answerRelation: Array<AnswerRelation>,
    public questionChildren: Array<Array<Question>>,
    public user_type_restriction: string,
    public min?: number,
    public max?: number
  ) {}
}
