import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { ProducerService } from '@services/producer/producer.service';
import { environment } from 'environment';
import mockForm from '../../../data/mock-form';
import { FilesystemService } from '@services/filesystem/filesystem.service';

@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private drafts: FormDetail.Form[] = [];
  private uuidArray: string[] = [];

  constructor(
    private storageService: StorageService,
    private producersService: ProducerService,
    private filesystemService: FilesystemService
  ) {}

  public pushDraft(draft: FormDetail.Form): void {
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString();
    draft.fechaInicial = formattedDate;
    draft.fechaUltimoCambio = formattedDate;
    this.drafts.push(draft);
    this.saveDraftInStorage(draft);
  }

  public deleteDraft(index: number) {
    const removedDraft: FormDetail.Form = this.drafts.splice(index, 1).pop()!;
    const producer: Beneficiary.Producer = removedDraft.beneficiary;
    if (removedDraft.id === 1 && producer.specialized)
      this.changeSpecialized(producer);
    this.storageService.remove(`${DRAFT_STORAGE_KEY}-${removedDraft.uuid}`);
    this.removeUUID(removedDraft.uuid);
    this.saveDrafts();
  }

  private changeSpecialized(producer: Beneficiary.Producer): void {
    const producers: Beneficiary.Producer[] =
      this.producersService.getProducers();
    const beneficiary: Beneficiary.Producer = producers.find(
      (p) => p.id === producer.id
    )!;
    beneficiary.specialized = false;
  }

  public removeDraft(draft: FormDetail.Form): FormDetail.Form {
    const index = this.drafts.findIndex((d) => d.uuid === draft.uuid);
    if (index > -1) {
      this.storageService.remove(`${DRAFT_STORAGE_KEY}-${draft.uuid}`);
      this.removeUUID(draft.uuid);
      return this.drafts.splice(index, 1)[0];
    }
    return draft;
  }

  private removeUUID(uuid: string): void {
    this.uuidArray = this.uuidArray.filter((id) => id !== uuid);
    this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
  }

  public getLocalDrafts(): void {
    this.getUUIDArrayFromStorage();
    this.createDraftsFolder();
    this.storageService.get('drafts').then((drafts) => {
      if (drafts) {
        this.drafts = drafts;
        this.removeOldDrafts();
      } else if (this.getDraftsArrayFromStorage()) {
        this.drafts = this.getDraftsArrayFromStorage();
      } else {
        this.drafts = [];
      }
      /* if (!environment.production){
        console.log('Creating mock drafts')
        this.createMockDrafts()
        console.log('Drafts:', this.drafts)
      } */
    });
    this.saveDrafts();
  }

  public getDraftsArrayFromStorage(): FormDetail.Form[] {
    var drafts: FormDetail.Form[] = [];
    for (let i = 0; i < this.uuidArray.length; i++) {
      this.storageService
        .get(`${DRAFT_STORAGE_KEY}-${this.uuidArray[i]}`)
        .then((draft) => {
          drafts.push(draft);
        });
    }
    return drafts;
  }

  private getUUIDArrayFromStorage(): void {
    this.storageService.get(UUID_ARRAY_STORAGE_KEY).then((uuidArray) => {
      this.uuidArray = uuidArray || [];
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
    for (let i = 0; i < this.drafts.length; i++) {
      this.saveDraftInStorage(this.drafts[i]);
    }
    this.storageService.remove('drafts');
  }

  public saveDraftInStorage(draft: FormDetail.Form): void {
    this.storageService.set(`${DRAFT_STORAGE_KEY}-${draft.uuid}`, draft);
    if (!this.uuidArray.includes(draft.uuid)) {
      this.uuidArray.push(draft.uuid);
      this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
    }
    this.saveDraftInFile(draft);
  }

  public generateUUID(): string {
    return uuidv4();
  }

  public updateModifyDate(draft: FormDetail.Form): void {
    const index = this.drafts.findIndex((d) => d.id === draft.id);
    if (index > -1) {
      const currentDate: Date = new Date();
      const formattedDate: string = currentDate.toISOString();
      this.drafts[index].fechaUltimoCambio = formattedDate;
    }
  }

  private async createDraftsFolder(): Promise<void> {
    const path: string = 'borradores';
    this.filesystemService.createFolder(path);
  }

  private async saveDraftInFile(draft: FormDetail.Form): Promise<void> {
    const draftId = draft.id;
    const draftBeneficiaryName = `${draft.beneficiary.firstname}-${draft.beneficiary.lastname}`;
    const timestamp = draft.fechaInicial;
    const path = `borradores/${draftId}-${draftBeneficiaryName}-${timestamp}.txt`;
    this.filesystemService.writeFile(path, JSON.stringify(draft));
  }

  /* private createMockDrafts(): void {
    const mockDrafts: FormDetail.Form[] = [];
    for (let i = 0; i < 30; i++) {
      console.log('Creating mock draft', i)
      mockDrafts.push(mockForm);
    }
    this.drafts = mockDrafts;
    this.saveDrafts();
  } */
}

const DRAFT_STORAGE_KEY = 'draft-storage';
const UUID_ARRAY_STORAGE_KEY = 'drafts-uuid-array';
