import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Beneficiary } from '@models/Beneficiary.namespace';

@Injectable({
  providedIn: 'root',
})
export class DraftService {

  private drafts: FormDetail.Form[] = [];

  constructor(private storageService: StorageService) {
    this.getLocalDrafts();
  }

  public pushDraft(draft: FormDetail.Form): void {
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString()
    draft.fechaInicial = formattedDate;
    draft.fechaUltimoCambio = formattedDate;
    this.drafts.push(draft);
  }

  public deleteDraft(index: number) {
    const removedDraft: FormDetail.Form = this.drafts.splice(index, 1).pop()!;
    const beneficiary: Beneficiary.Producer = removedDraft.beneficiary;
    if (removedDraft.id === 1 && beneficiary.specialized)
      beneficiary.specialized = false;

    this.saveDrafts();
  }

  public removeDraft(draft: FormDetail.Form): FormDetail.Form {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      return this.drafts.splice(index, 1)[0];
    }
    return draft;
  }

  public getLocalDrafts(): void {
    this.storageService.get('drafts').then((drafts) => {
      if (drafts) {
        this.drafts = drafts;
        this.removeOldDrafts();
      }
    });
  }

  public getDrafts(): FormDetail.Form[] {
    return this.drafts;
  }

  private removeOldDrafts(): void {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 7);
    this.drafts = this.drafts.filter((draft) => {
      const date = new Date(draft.fechaUltimoCambio);
      return date >= dateThreshold;
    });
  }

  public saveDrafts(): void {
    this.storageService.set('drafts', this.drafts);
  }

  public generateUUID(): string {
    return uuidv4();
  }

  public updateModifyDate(draft: FormDetail.Form): void {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      const currentDate: Date = new Date();
      const formattedDate: string = currentDate.toISOString()
      this.drafts[index].fechaUltimoCambio = formattedDate;
    }
  }
}
