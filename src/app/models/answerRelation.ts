import { AnswerPivot } from "./answerPivot";

export class AnswerRelation {
  constructor(
    public id: number,
    public question_id: number,
    public pivot: AnswerPivot
  ) {}
}
