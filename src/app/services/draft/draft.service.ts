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
    const copy: Form = { ...draft };
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toLocaleDateString(
      'es-ES',
      options
    );
    copy.fechaInicial = formattedDate;
    copy.fechaUltimoCambio = formattedDate;
    this.drafts.push(copy);
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
        console.log(drafts);
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
    console.log('Saved drafts');
    const savedDrafts: Form[] = this.getDrafts();
    console.log(savedDrafts);
  }

  public generateUUID(): string {
    return uuidv4();
  }
}
