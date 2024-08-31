import { Beneficiary } from '@models/Beneficiary.namespace';
import { FormDetail } from '@models/FormDetail.namespace';

export interface IDraftService {
  pushDraft(draft: FormDetail.Form): void;
  deleteDraft(index: number): void;
  removeDraft(draft: FormDetail.Form): FormDetail.Form;
  getLocalDrafts(): void;
  getDraftsArrayFromStorage(): FormDetail.Form[];
  getDrafts(): FormDetail.Form[];
  saveDrafts(): void;
  saveDraftInStorage(draft: FormDetail.Form): void;
  generateUUID(): string;
  updateModifyDate(draft: FormDetail.Form): void;
}
