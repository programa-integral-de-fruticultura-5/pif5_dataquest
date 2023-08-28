import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {

  private associations: any[] = [];
  private readonly ENDPOINT = 'associations';

  constructor(private apiService: ApiService) { }

  public sendRequest(): void {
    this.apiService.post(this.ENDPOINT).then(
      (associations) => {
        this.associations = JSON.parse(associations.data);
        console.log(this.associations);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getAssociations(): any[] {
    return this.associations;
  }

}
