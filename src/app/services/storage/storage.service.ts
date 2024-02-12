import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    const storage = await this.storage.create();
    this._storage = storage;
    this.length().then((length) => {
      console.log('Storage length:', length);
    });
    this.keys().then((keys) => {
      console.log('Storage keys:', keys);
    });
    this.showStorage();
  }

  async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  async get(key: string) {
    return await this._storage?.get(key);
  }

  async remove(key: string){
    return await this._storage?.remove(key);
  }

  async clear() {
    return await this._storage?.clear();
  }

  async length() {
    return await this._storage?.length();
  }

  async keys() {
    return await this._storage?.keys();
  }

  showStorage() {
    this._storage?.forEach((value, key, index) => {
      console.log('Key:', key);
      console.log('Index:', index);
      console.log('Value:', value);
    });
  }
}
