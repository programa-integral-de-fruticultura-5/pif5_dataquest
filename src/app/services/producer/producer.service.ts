import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';
import { Producer } from 'src/app/models/beneficiary/producer';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class ProducerService {
  private producers: Producer[];
  private readonly ENDPOINT = 'producers';

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.producers = [];
    this.requestProducers();
    this.enableListener();
  }

  private enableListener() {
    Network.addListener('networkStatusChange', (status) => {
      let connectionType = status.connectionType;
      if (connectionType === 'wifi' || connectionType === 'cellular') {
        this.requestProducers();
      }
    });
  }

  public async requestProducers(): Promise<void> {
    const { connected } = await Network.getStatus();
    if (connected) {
      this.getLocalProducers();
      this.getRemoteProducers();
    } else {
      this.getLocalProducers();
    }
  }

  private getLocalProducers(): void {
    this.storageService.get('producers')?.then((producers) => {
      if (producers) {
        this.producers = producers;
      }
    });
  }

  private setLocalProducers(): void {
    this.storageService.set('producers', this.producers);
  }

  private getRemoteProducers(): void {
    this.apiService.post(this.ENDPOINT).then(
      (response) => {
        const producers = JSON.parse(response.data);
        this.processProducers(producers);
        this.setLocalProducers();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private processProducers(producers: any[]): void {
    producers.forEach((producer) => {
      const foundProducer = this.producers.find(
        (p) => p.id === producer.identification
      );

      if (!foundProducer) {
        const newProducer = new Producer(
          producer.cedula,
          producer.primer_nombre,
          producer.segundo_nombre,
          producer.primer_apellido,
          producer.segundo_apellido,
          producer.identification,
          producer.has_especializada,
          producer.at_p5,
          producer.pd_p5,
          producer.cm_p5,
          producer.insumo_p5,
          producer.association_id
        );
        this.producers.push(newProducer);
      }
    });
  }

  public getProducers(): any[] {
    return this.producers;
  }
}
