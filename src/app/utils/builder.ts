import { Authentication } from '@models/Auth.namespace';
import { Beneficiary } from '@models/Beneficiary.namespace';

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
