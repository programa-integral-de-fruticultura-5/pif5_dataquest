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

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  public getAssociations(forceRefresh: boolean = false): Observable<Beneficiary.Association[]> {
    return from(Network.getStatus()).pipe(
      switchMap((status) => {
        if (!status.connected || !forceRefresh) {
          return this.getLocalAssociations();
        } else {
          return from(this.apiService.post(ENDPOINT)).pipe(
            map((response: HttpResponse) => {
              const associationResponse: Beneficiary.AssociationResponse[] = JSON.parse(
                response.data
              );
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

  private async getLocalAssociations(): Promise<Beneficiary.Association[]> {
    return await this.storageService.get(ASSOCIATIONS_STORAGE_KEY)
  }

  public async getAssociationById(id: number):  Promise<Beneficiary.Association | undefined>/* Observable<Beneficiary.Association | undefined> */ {
    const associations: Beneficiary.Association[] = await this.getLocalAssociations();
    return associations.find((association) => association.id === id);
/*     return from(this.getLocalAssociations()).pipe(
      map((associations: Beneficiary.Association[]) => {
        return associations.find((association) => association.id === id);
      })
    ); */
  }
}

const ASSOCIATIONS_STORAGE_KEY = 'associations';
const ENDPOINT = ASSOCIATIONS_STORAGE_KEY;
