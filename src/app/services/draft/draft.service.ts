import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DraftService {

  private drafts: Form[];

  constructor(private storageService: StorageService) {
    this.drafts = [];
    this.loadDrafts();
  }

  public pushDraft(draft: Form): void {
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString()
    draft.fechaInicial = formattedDate;
    draft.fechaUltimoCambio = formattedDate;
    this.drafts.push(draft);
  }

  public deleteDraft(index: number) {
    this.drafts.splice(index, 1);
    this.saveDrafts();
  }

  public removeDraft(draft: Form): Form {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      return this.drafts.splice(index, 1)[0];
    }
    return draft;
  }

  public loadDrafts(): void {
    this.storageService.get('drafts')?.then((drafts) => {
      if (drafts) {
        this.drafts = drafts;
        this.removeOldDrafts();
      }
    });
  }

  public getDrafts(): Form[] {
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

  public updateModifyDate(draft: Form): void {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      const currentDate: Date = new Date();
      const formattedDate: string = currentDate.toISOString()
      this.drafts[index].fechaUltimoCambio = formattedDate;
    }
  }
}
