import { Question } from "./question";

export class Form {
  constructor(
    public id: number,
    public name: string,
    public fechaDescarga: string,
    public fechaInicial: string,
    public fechaUltimoCambio: string,
    public fechaCarga: string,
    public sync: boolean,
    public position: string,
    public altitud: number,
    public dateInit: string,
    public dateEnd: string,
    public fatherId: any,
    public fatherName: string,
    public questions: Array<Question>,
    public description: string,
    public respondent: string,
    public metadataId: number
  ) {}
}
