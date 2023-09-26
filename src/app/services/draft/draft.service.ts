import { Injectable } from '@angular/core';
import { Form } from 'src/app/models/form';
import { StorageService } from '../storage/storage.service';

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
    const copy = { ...draft };
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
      return date < dateThreshold;
    });
  }

  public saveDrafts(): void {
    this.storageService.set('drafts', this.drafts);
    console.log('Saved drafts')
    const savedDrafts: Form[] = this.getDrafts();
    console.log(savedDrafts)
  }
}
