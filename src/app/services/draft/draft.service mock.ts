import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { customAlphabet } from 'nanoid';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { ProducerService } from '@services/producer/producer.service';
import { FilesystemService } from '@services/filesystem/filesystem.service';
import { IDraftService } from './draft.service.interface';
import mockForm from 'data/mock-form';

@Injectable({
  providedIn: 'root',
})
export class MockDraftService implements IDraftService {
  private drafts: FormDetail.Form[] = [];
  private uuidArray: string[] = [];

  constructor(
    private storageService: StorageService,
    private producersService: ProducerService,
    private filesystemService: FilesystemService,
  ) {
  }

  public pushDraft(draft: FormDetail.Form): void {
    const methodName = 'pushDraft';
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString();
    draft.fechaInicial = formattedDate;
    draft.fechaUltimoCambio = formattedDate;
    this.drafts.push(draft);
    this.saveDraftInStorage(draft);
  }

  public deleteDraft(index: number) {
    const methodName = 'deleteDraft';
    const removedDraft: FormDetail.Form = this.drafts.splice(index, 1).pop()!;
    const producer: Beneficiary.Producer = removedDraft.beneficiary;
    if (removedDraft.id === 1 && producer.specialized)
      this.changeSpecialized(producer);
    this.storageService.remove(`${DRAFT_STORAGE_KEY}-${removedDraft.uuid}`);
    this.removeUUID(removedDraft.uuid);
    this.saveDrafts();
  }

  private changeSpecialized(producer: Beneficiary.Producer): void {
    const methodName = 'changeSpecialized';
    const producers: Beneficiary.Producer[] =
      this.producersService.getProducers();
    const beneficiary: Beneficiary.Producer = producers.find(
      (p) => p.id === producer.id
    )!;
    beneficiary.specialized = false;
  }

  public removeDraft(draft: FormDetail.Form): FormDetail.Form {
    const methodName = 'removeDraft';
    const index = this.drafts.findIndex((d) => d.uuid === draft.uuid);
    if (index > -1) {
      this.storageService.remove(`${DRAFT_STORAGE_KEY}-${draft.uuid}`);
      this.removeUUID(draft.uuid);
      const removedDraft = this.drafts.splice(index, 1)[0];
      return removedDraft;
    }
    return draft;
  }

  private removeUUID(uuid: string): void {
    const methodName = 'removeUUID';
    this.uuidArray = this.uuidArray.filter((id) => id !== uuid);
    this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
  }

  public getLocalDrafts(): void {
    const methodName = 'getLocalDrafts';
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
    });
    this.saveDrafts();
  }

  public getDraftsArrayFromStorage(): FormDetail.Form[] {
    const methodName = 'getDraftsArrayFromStorage';
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
    const methodName = 'getUUIDArrayFromStorage';
    this.storageService.get(UUID_ARRAY_STORAGE_KEY).then((uuidArray) => {
      this.uuidArray = uuidArray || [];
    });
  }

  public getDrafts(): FormDetail.Form[] {
    const methodName = 'getDrafts';
    this.createMockDrafts();
    return this.drafts;
  }

  private removeOldDrafts(): void {
    const methodName = 'removeOldDrafts';
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 7);
    this.drafts = this.drafts.filter((draft) => {
      const date = new Date(draft.fechaUltimoCambio);
      return date >= dateThreshold;
    });
  }

  public saveDrafts(): void {
    const methodName = 'saveDrafts';
    for (let i = 0; i < this.drafts.length; i++) {
      this.saveDraftInStorage(this.drafts[i]);
    }
    this.storageService.remove('drafts');
  }

  public saveDraftInStorage(draft: FormDetail.Form): void {
    const methodName = 'saveDraftInStorage';
    this.storageService.set(`${DRAFT_STORAGE_KEY}-${draft.uuid}`, draft);
    if (!this.uuidArray.includes(draft.uuid)) {
      this.uuidArray.push(draft.uuid);
      this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
    }
    this.saveDraftInFile(draft);
  }

  public generateUUID(): string {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return nanoid(5);
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
    const methodName = 'saveDraftInFile';
    if (draft.beneficiary.cedula === '' || draft.beneficiary.id === '') {
      return;
    }
    const draftId = draft.id;
    const draftBeneficiaryName = `${draft.beneficiary.firstname}-${draft.beneficiary.lastname}`;
    const timestamp = draft.fechaInicial;
    const path = `borradores/${draftId}-${draftBeneficiaryName}-${timestamp}/${draftId}-${draftBeneficiaryName}-${timestamp}.txt`;
    this.filesystemService.writeFile(path, JSON.stringify(draft));
  }

  private createMockDrafts(): void {
    const methodName = 'createMockDrafts';
    const mockDrafts: FormDetail.Form[] = [];

    let i = 0; // Initialize the counter
    const intervalId = setInterval(() => {
      if (i < 10) {
        mockDrafts.push(mockForm); // Add a new mock draft

        this.drafts = mockDrafts;
        this.saveDrafts(); // Save the drafts

        i++; // Increment the counter
      } else {
        clearInterval(intervalId); // Stop the interval after 10 drafts are added
      }
    }, 5000); // 5000ms = 5 seconds
  }
}

const DRAFT_STORAGE_KEY = 'mock-draft-storage';
const UUID_ARRAY_STORAGE_KEY = 'mock-drafts-uuid-array';
