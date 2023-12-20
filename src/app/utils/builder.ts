import { Authentication } from '@models/Auth.namespace';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { FormDetail } from '@models/FormDetail.namespace';

export function userBuilder(
  user: Authentication.UserResponse
): Authentication.User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerifiedAt: user.email_verified_at,
    idCard: user.cedula,
    role: user.roles,
    type: user.types,
    zone: user.zone,
    creationDate: user.created_at,
    updatedDate: user.updated_at,
  };
}

export function formBuilder(form: FormDetail.FormResponse): FormDetail.Form {
  return {
    id: form.id,
    uuid: '',
    name: form.name,
    fechaDescarga: '',
    fechaInicial: '',
    fechaUltimoCambio: '',
    fechaCarga: '',
    sync: false,
    position: '',
    altitud: 0,
    dateInit: form.dateInit,
    dateEnd: form.dateEnd,
    questions: form.questions.map((question) => questionBuilder(question)),
    description: form.description,
    beneficiary: Beneficiary.ProducerBaseParams,
  };
}

function questionBuilder(
  question: FormDetail.QuestionResponse
): FormDetail.Question {
  return {
    id: question.id.toString(),
    text: question.text,
    type: question.type,
    required: question.required,
    dataType: question.dataType,
    order: question.order,
    answerLength: 0,
    extendable: false,
    questionParentId: question.questionParentId?.toString(),
    answers: question.answers.map((answer) => answerBuilder(answer)),
    questionCategoryId: question.question_category_id,
    questionCategory: questionCategoryBuilder(question.question_category),
    answersRelation: question.answers_relation.map((relation) =>
      answerRelationBuilder(relation)
    ),
    questionChildren: [],
    userTypeRestriction: question.user_type_restriction,
    min: question.min,
    max: question.max,
  };
}

function answerBuilder(answer: FormDetail.AnswerResponse): FormDetail.Answer {
  return {
    id: answer.id,
    questionId: answer.question_id.toString(),
    value: answer.value,
    order: answer.order,
    checked: false,
  };
}

function questionCategoryBuilder(
  category: FormDetail.QuestionCategoryResponse
): FormDetail.QuestionCategory {
  return {
    id: category.id,
    name: category.name,
  };
}

function answerRelationBuilder(
  relation: FormDetail.AnswerRelationResponse
): FormDetail.AnswerRelation {
  return {
    id: relation.id,
    questionId: relation.question_id.toString(),
    answerPivot: answerPivotBuilder(relation.pivot),
  };
}

function answerPivotBuilder(
  pivot: FormDetail.AnswerPivotResponse
): FormDetail.AnswerPivot {
  return {
    questionId: pivot.question_id.toString(),
    answerId: pivot.answer_id,
    type: pivot.type,
  };
}

export function producerBuilder(
  producer: Beneficiary.ProducerResponse
): Beneficiary.Producer {
  return {
    cedula: producer.cedula,
    firstname: producer.primer_nombre,
    middlename: producer.segundo_nombre,
    lastname: producer.primer_apellido,
    secondLastname: producer.segundo_apellido,
    id: producer.identification,
    specialized: producer.has_especializada === 1,
    technicalAssistance: producer.at_p5 === 1,
    demonstrationPlot: producer.pd_p5 === 1,
    greenhouse: producer.cm_p5 === 1,
    supplies: producer.insumo_p5 === 1,
    associationId: producer.association_id,
    transplantDate: producer.transplantDate,
    recommendedActions: producer.selectedQuestionIds,
  };
}

export function associationBuilder(
  association: Beneficiary.AssociationResponse
): Beneficiary.Association {
  return {
    id: association.id,
    nit: association.nit,
    name: association.name,
    identification: association.identification,
    zone: association.zona,
    farming: association.farming,
  };
}
