import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  public getAll<T> (endpoint: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`/api/${endpoint}/`);
  }

  public get<T> (endpoint: string, id: string): Observable<T> {
    return this.httpClient.get<T>(`/api/${endpoint}/${id}`);
  }

  public post (endpoint: string, resource?: { email: string; password: string; }): Observable<any> {
    return this.httpClient.post(`/api/${endpoint}/`, resource);
  }
}
