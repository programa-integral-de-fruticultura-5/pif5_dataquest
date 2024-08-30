import { Injectable } from '@angular/core';
import { FormDetail } from '@models/FormDetail.namespace';
import { StorageService } from '../storage/storage.service';
import { customAlphabet } from 'nanoid';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { ProducerService } from '@services/producer/producer.service';
import { FilesystemService } from '@services/filesystem/filesystem.service';
import { Logger, LoggingService } from 'ionic-logging-service';
import { IDraftService } from './draft.service.interface';
import mockForm from 'data/mock-form';

@Injectable({
  providedIn: 'root',
})
export class MockDraftService implements IDraftService {
  private drafts: FormDetail.Form[] = [];
  private uuidArray: string[] = [];
  private logger: Logger;

  constructor(
    private storageService: StorageService,
    private producersService: ProducerService,
    private filesystemService: FilesystemService,
    private loggingService: LoggingService
  ) {
    this.logger = this.loggingService.getLogger('DraftService');
  }

  public pushDraft(draft: FormDetail.Form): void {
    const methodName = 'pushDraft';
    this.logger.entry(methodName, draft);
    const currentDate: Date = new Date();
    const formattedDate: string = currentDate.toISOString();
    draft.fechaInicial = formattedDate;
    draft.fechaUltimoCambio = formattedDate;
    this.drafts.push(draft);
    this.saveDraftInStorage(draft);
    this.logger.exit(methodName);
  }

  public deleteDraft(index: number) {
    const methodName = 'deleteDraft';
    this.logger.entry(methodName, index);
    const removedDraft: FormDetail.Form = this.drafts.splice(index, 1).pop()!;
    const producer: Beneficiary.Producer = removedDraft.beneficiary;
    if (removedDraft.id === 1 && producer.specialized)
      this.changeSpecialized(producer);
    this.storageService.remove(`${DRAFT_STORAGE_KEY}-${removedDraft.uuid}`);
    this.removeUUID(removedDraft.uuid);
    this.saveDrafts();
    this.logger.exit(methodName);
  }

  private changeSpecialized(producer: Beneficiary.Producer): void {
    const methodName = 'changeSpecialized';
    this.logger.entry(methodName, producer);
    const producers: Beneficiary.Producer[] =
      this.producersService.getProducers();
    const beneficiary: Beneficiary.Producer = producers.find(
      (p) => p.id === producer.id
    )!;
    beneficiary.specialized = false;
    this.logger.exit(methodName);
  }

  public removeDraft(draft: FormDetail.Form): FormDetail.Form {
    const methodName = 'removeDraft';
    this.logger.entry(methodName, draft);
    const index = this.drafts.findIndex((d) => d.uuid === draft.uuid);
    this.logger.debug(methodName, 'Index:', index);
    if (index > -1) {
      this.storageService.remove(`${DRAFT_STORAGE_KEY}-${draft.uuid}`);
      this.removeUUID(draft.uuid);
      const removedDraft = this.drafts.splice(index, 1)[0];
      this.logger.exit(methodName, removedDraft);
      return removedDraft;
    }
    this.logger.exit(methodName);
    return draft;
  }

  private removeUUID(uuid: string): void {
    const methodName = 'removeUUID';
    this.logger.entry(methodName, uuid);
    this.uuidArray = this.uuidArray.filter((id) => id !== uuid);
    this.logger.debug(methodName, 'UUID Array:', this.uuidArray);
    this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
    this.logger.exit(methodName);
  }

  public getLocalDrafts(): void {
    const methodName = 'getLocalDrafts';
    this.logger.entry(methodName);
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
    this.logger.exit(methodName, this.drafts);
  }

  public getDraftsArrayFromStorage(): FormDetail.Form[] {
    const methodName = 'getDraftsArrayFromStorage';
    this.logger.entry(methodName);
    var drafts: FormDetail.Form[] = [];
    for (let i = 0; i < this.uuidArray.length; i++) {
      this.storageService
        .get(`${DRAFT_STORAGE_KEY}-${this.uuidArray[i]}`)
        .then((draft) => {
          drafts.push(draft);
        });
    }
    this.logger.exit(methodName, drafts);
    return drafts;
  }

  private getUUIDArrayFromStorage(): void {
    const methodName = 'getUUIDArrayFromStorage';
    this.logger.entry(methodName);
    this.storageService.get(UUID_ARRAY_STORAGE_KEY).then((uuidArray) => {
      this.uuidArray = uuidArray || [];
    });
    this.logger.exit(methodName, this.uuidArray);
  }

  public getDrafts(): FormDetail.Form[] {
    this.loggingService.removeLogMessagesFromLocalStorage('ionic-logging-service');
    const methodName = 'getDrafts';
    this.logger.entry(methodName);
    this.createMockDrafts();
    this.logger.exit(methodName);
    return this.drafts;
  }

  private removeOldDrafts(): void {
    const methodName = 'removeOldDrafts';
    this.logger.entry(methodName);
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 7);
    this.drafts = this.drafts.filter((draft) => {
      const date = new Date(draft.fechaUltimoCambio);
      return date >= dateThreshold;
    });
    this.logger.exit(methodName, this.drafts);
  }

  public saveDrafts(): void {
    const methodName = 'saveDrafts';
    this.logger.entry(methodName);
    for (let i = 0; i < this.drafts.length; i++) {
      this.saveDraftInStorage(this.drafts[i]);
    }
    this.storageService.remove('drafts');
    this.logger.exit(methodName, this.drafts);
  }

  public saveDraftInStorage(draft: FormDetail.Form): void {
    const methodName = 'saveDraftInStorage';
    this.logger.entry(methodName, draft);
    this.storageService.set(`${DRAFT_STORAGE_KEY}-${draft.uuid}`, draft);
    if (!this.uuidArray.includes(draft.uuid)) {
      this.uuidArray.push(draft.uuid);
      this.storageService.set(UUID_ARRAY_STORAGE_KEY, this.uuidArray);
    }
    this.saveDraftInFile(draft);
    this.logger.exit(methodName);
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
    this.logger.entry(methodName, draft);
    if (draft.beneficiary.cedula === '' || draft.beneficiary.id === '') {
      this.logger.error(methodName, 'Draft has no beneficiary');
      this.logger.exit(methodName);
      return;
    }
    const draftId = draft.id;
    const draftBeneficiaryName = `${draft.beneficiary.firstname}-${draft.beneficiary.lastname}`;
    const timestamp = draft.fechaInicial;
    const path = `borradores/${draftId}-${draftBeneficiaryName}-${timestamp}/${draftId}-${draftBeneficiaryName}-${timestamp}.txt`;
    this.filesystemService.writeFile(path, JSON.stringify(draft));
    this.logger.exit(methodName);
  }

  private createMockDrafts(): void {
    const methodName = 'createMockDrafts';
    this.logger.entry(methodName);
    const mockDrafts: FormDetail.Form[] = [];

    let i = 0; // Initialize the counter
    const intervalId = setInterval(() => {
      if (i < 10) {
        this.logger.debug(methodName, 'Creating mock draft', i);
        mockDrafts.push(mockForm); // Add a new mock draft

        this.logger.debug(methodName, 'Current mock drafts:', mockDrafts);
        this.drafts = mockDrafts;
        this.saveDrafts(); // Save the drafts

        i++; // Increment the counter
      } else {
        clearInterval(intervalId); // Stop the interval after 10 drafts are added
        this.logger.exit(methodName);
      }
    }, 5000); // 5000ms = 5 seconds
  }
}

const DRAFT_STORAGE_KEY = 'mock-draft-storage';
const UUID_ARRAY_STORAGE_KEY = 'mock-drafts-uuid-array';
