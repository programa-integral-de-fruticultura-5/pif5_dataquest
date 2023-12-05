import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { StorageService } from '../storage/storage.service';
import { Network } from '@capacitor/network';
import { Observable, from, map, switchMap, tap } from 'rxjs';
import { HttpResponse } from '@capacitor/core';
import { associationBuilder } from '@utils/builder';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {

  associations: Beneficiary.Association[] = [];

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.syncAssociations(true).subscribe((associations: Beneficiary.Association[]) => {
      this.associations = associations;
    });
  }

  public getAssociations(): Beneficiary.Association[] {
    console.log(this.associations);
    return this.associations;
  }

  private syncAssociations(forceRefresh: boolean = false): Observable<Beneficiary.Association[]> {
    return from(Network.getStatus()).pipe(
      switchMap((status) => {
        console.log('status')
        console.log(status.connected)
        if (!status.connected || !forceRefresh) {
          return from(this.getLocalAssociations());
        } else {
          console.log('syncAssociations')
          return from(this.apiService.post(ENDPOINT)).pipe(
            map((response: HttpResponse) => {
              const associationResponse: Beneficiary.AssociationResponse[] = JSON.parse(
                response.data
              );
              console.log('associationResponse');
              console.log(associationResponse);
              const associations: Beneficiary.Association[] = associationResponse.map(
                (association) => associationBuilder(association)
              );
              return associations;
            }),
            tap((associations: Beneficiary.Association[]) => {
              this.setLocalAssociations(associations);
            })
          );
        }
      })
    );
  }

  private setLocalAssociations(associations: Beneficiary.Association[]): void {
    this.storageService.set('associations', associations);
  }

  private getLocalAssociations(): Promise<Beneficiary.Association[]> {
    return this.storageService.get(ASSOCIATIONS_STORAGE_KEY)
  }

  public getAssociationById(id: number): Beneficiary.Association | undefined {
    return this.associations.find((association) => association.id === id);
  }
}

const ASSOCIATIONS_STORAGE_KEY = 'associations';
const ENDPOINT = ASSOCIATIONS_STORAGE_KEY;
