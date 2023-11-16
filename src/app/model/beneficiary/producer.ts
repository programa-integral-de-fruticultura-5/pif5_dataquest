export class Producer {
  constructor(
    public cedula: string,
    public firstname: string,
    public middlename: string,
    public lastname: string,
    public secondLastname: string,
    public id: string,
    public specialized: boolean,
    public technicalAssistance: boolean, // asistencia técnica
    public demonstrationPlot: boolean, // parcela demostrativa
    public greenhouse: boolean, // casa malla (invernadero espacial)
    public supplies: boolean, // insumos
    public associationId: number // id de la asociacion
  ) {}
}
