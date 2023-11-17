import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { StorageService } from '../storage/storage.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  private associations: Beneficiary.Association[];
  private readonly ENDPOINT = 'associations';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.associations = [];
    this.requestAssociations();
    this.enableListner();
  }

  private enableListner() {
    Network.addListener('networkStatusChange', (status) => {
      let connectionType = status.connectionType;
      if (connectionType === 'wifi' || connectionType === 'cellular') {
        this.requestAssociations();
      }
    });
  }

  public async requestAssociations(): Promise<void> {
    const { connected } = await Network.getStatus();
    if (connected) {
      this.getLocalAssociations();
      this.getRemoteAssociations();
    } else {
      this.getLocalAssociations();
    }
  }

  private getRemoteAssociations(): void {
    this.apiService.post(this.ENDPOINT).then(
      (response) => {
        const associations = JSON.parse(response.data);
        this.processAssociations(associations);
        this.setLocalAssociations();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getAssociations(): any[] {
    return this.associations;
  }

  private setLocalAssociations(): void {
    this.storageService.set('associations', this.associations);
  }

  private getLocalAssociations(): void {
    this.storageService.get('associations')?.then((associations) => {
      if (associations) {
        this.associations = associations;
      }
    });
  }

  private processAssociations(associations: any[]): void {
    associations.forEach((association) => {
      const foundAssociation = this.associations.find(
        (a) => a.id === association.identification
      );

      if (!foundAssociation) {
        const newAssociation = new Beneficiary.Association(
          association.id,
          association.nit,
          association.name,
          association.identification,
          association.zone,
          association.farming
        );

        this.associations.push(newAssociation);
      }
    });
  }

  public getAssociationById(id: number): Beneficiary.Association | undefined {
    return this.associations.find((association) => association.id === id);
  }
}
