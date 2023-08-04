export class Answer {

  constructor(
    public id: number,
    public order: number,
    public questionId: number,
    public text: string,
    public value: string
  ) {}

}
