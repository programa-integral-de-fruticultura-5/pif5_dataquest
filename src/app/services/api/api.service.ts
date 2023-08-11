import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

const url = 'http://192.168.1.36:8060';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
  ) {}

  public getAll<T> (endpoint: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`/api/${endpoint}/`);
  }

  public get<T> (endpoint: string, id: string): Observable<T> {
    return this.httpClient.get<T>(`/api/${endpoint}/${id}`);
  }

  /* public post<T> (endpoint: string, resource?: { email: string; password: string; }): Observable<T> {
    return this.httpClient.post<T>(`/api/${endpoint}/`, resource);
  } */

  public post (endpoint: string, resource?: { email: string; password: string; }): Promise<HttpResponse> {
    const token = window.sessionStorage.getItem('TOKEN_KEY');

    const options = {
      url: `http://192.168.1.36:8060/api/${endpoint}/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: resource
    }

    return CapacitorHttp.post(options);
  }
}
