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
    supportDemonstrationPlot: boolean;
    greenhouse: boolean;
    supplies: boolean;
    associationId: number;
    transplantDate: string;
    recommendedActions: SelectedQuestions
    support: boolean; // Support visit / Technical Assistance
    preloadedQuestions: PreloadedQuestion;
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
    supportDemonstrationPlot: false,
    greenhouse: false,
    supplies: false,
    associationId: 0,
    transplantDate: '',
    recommendedActions: {},
    support: false,
    preloadedQuestions: {}
  };

  export type ProducerResponse = {
    cedula: string;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    identification: string;
    has_especializada: number;
    sost_p5: number;        // support visit
    at_p5: number;          // asistencia técnica
    pd_p5: number;          // parcela demostrativa
    cm_p5: number;          // casa malla (invernadero espacial)
    pd_at: number;          // parcela demostrativa asistencia técnica
    insumo_p5: number;      // insumos
    association_id: number; // id de la asociacion
    transplantDate: string;
    selectedQuestionIds: SelectedQuestions
    QuestionPreloaded: PreloadedQuestion;
  }

  export type SelectedQuestions = { [questionId: string] : boolean };

  export type PreloadedQuestion = { [questionId: string] : string | boolean };

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
