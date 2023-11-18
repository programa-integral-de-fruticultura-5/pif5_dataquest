import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';
import { Beneficiary } from '@models/Beneficiary.namespace';
import { Network } from '@capacitor/network';
import { Observable, from } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { HttpResponse } from '@capacitor/core';
import { producerBuilder } from '@utils/builder';

@Injectable({
  providedIn: 'root',
})
export class ProducerService {
  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
  ) {}

  public getProducers(
    forceRefresh: boolean = false
  ): Observable<Beneficiary.Producer[]> {
    return from(Network.getStatus()).pipe(
      switchMap((status) => {
        if (!status.connected || !forceRefresh) {
          return this.getLocalProducers();
        } else {
          return from(this.apiService.post(ENDPOINT)).pipe(
            map((response: HttpResponse) => {
              const producerResponse: Beneficiary.ProducerResponse[] =
                JSON.parse(response.data);
              const producers: Beneficiary.Producer[] = producerResponse.map(
                (producer) => producerBuilder(producer)
              );
              return producers;
            }),
            tap((producers: Beneficiary.Producer[]) => {
              this.setLocalProducers(producers);
            })
          );
        }
      })
    );
  }

  private async getLocalProducers(): Promise<Beneficiary.Producer[]> {
    return await this.storageService.get(PRODUCERS_STORAGE_KEY);
  }

  private setLocalProducers(producers: Beneficiary.Producer[]): void {
    this.storageService.set(ENDPOINT, producers);
  }
}

const PRODUCERS_STORAGE_KEY = 'producers';
const ENDPOINT = PRODUCERS_STORAGE_KEY;
