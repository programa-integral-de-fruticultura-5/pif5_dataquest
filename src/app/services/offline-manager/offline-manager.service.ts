import { Injectable } from '@angular/core';
import { HttpResponse } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '@services/api/api.service';
import { StorageService } from '@services/storage/storage.service';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class OfflineManagerService {

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private toastController: ToastController
  ) {}

  public checkForEvents(): Observable<any> {
    return from(this.storageService.get(STORAGE_REQ_KEY)).pipe(
      switchMap((storedOperations: StoredRequest[]) => {
        let storedObj: StoredRequest[] = storedOperations;
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              let toast = this.toastController.create({
                message: `Local data succesfully synced to API!`,
                duration: 3000,
                position: 'bottom',
              });
              toast.then((toast) => toast.present());
              this.storageService.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          console.log('no local events to sync');
          return of(false);
        }
      })
    );
  }

  public async storeRequest(url: string, data: any): Promise<any> {
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom',
    });
    toast.then((toast) => toast.present());

    const action: StoredRequest = {
      url: url,
      data: data,
      time: new Date().getTime(),
      id: uuidv4(),
    };

    const storedOperations = await this.storageService.get(STORAGE_REQ_KEY);
    let storedObj: StoredRequest[] = JSON.parse(storedOperations);
    if (storedObj) {
      storedObj.push(action);
    } else {
      storedObj = [action];
    }
    return await this.storageService.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
  }

  private sendRequests(operations: StoredRequest[]): Observable<HttpResponse[]> {
    let obs = [];
    for (let op of operations) {
      console.log('Make one request: ', op);
      let oneObs = this.apiService.post(op.url, op.data);
      obs.push(oneObs);
    }
    return forkJoin(obs);
  }
}

const STORAGE_REQ_KEY: string = 'storedreq';


interface StoredRequest {
  url: string;
  data: any;
  time: number;
  id: string;
}
