export namespace Beneficiary {

  export interface Producer {
    cedula: string;
    firstname: string;
    middlename: string;
    lastname: string;
    secondLastname: string;
    id: string;
    specialized: boolean;
    technicalAssistance: boolean;
    demonstrationPlot: boolean;
    greenhouse: boolean;
    supplies: boolean;
    associationId: number;
    transplantDate: string;
    recommendedActions: SelectedQuestions
  }

  export const ProducerBaseParams = {
    cedula: '',
    firstname: '',
    middlename: '',
    lastname: '',
    secondLastname: '',
    id: '',
    specialized: false,
    technicalAssistance: false,
    demonstrationPlot: false,
    greenhouse: false,
    supplies: false,
    associationId: 0,
    transplantDate: '',
    recommendedActions: {}
  };

  export type ProducerResponse = {
    cedula: string;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    identification: string;
    has_especializada: number;
    at_p5: number;          // asistencia técnica
    pd_p5: number;          // parcela demostrativa
    cm_p5: number;          // casa malla (invernadero espacial)
    insumo_p5: number;      // insumos
    association_id: number; // id de la asociacion
    transplantDate: string;
    selectedQuestionIds: SelectedQuestions
  }

  export type SelectedQuestions = { [questionId: string] : boolean };

  export interface Association {
    id: number;
    nit: number;
    name: string;
    identification: string;
    zone: string;
    farming: string;
  }

  export type AssociationResponse = {
    id: number;
    nit: number;
    name: string;
    identification: string;
    zona: string;
    farming: string;
  }
}
