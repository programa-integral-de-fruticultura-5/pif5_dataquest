export class Answer {

  constructor(
    public id: number,
    public order: number,
    public questionId: number,
    public checked: boolean,
    public value: string
  ) {}

}
