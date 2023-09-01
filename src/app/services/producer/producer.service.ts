import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {

  private producers: any[] = [];
  private readonly ENDPOINT = 'producers';

  constructor(private apiService: ApiService) { }

  public sendRequest(): void {
    this.apiService.post(this.ENDPOINT).then(
      (producers) => {
        this.producers = JSON.parse(producers.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getProducers(): any[] {
    return this.producers;
  }
}
