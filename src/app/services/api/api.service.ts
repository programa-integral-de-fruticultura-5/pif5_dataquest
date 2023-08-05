import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = "https://api.escuelajs.co/api/v1/auth"
// const API_URL = 'https://dev.programaintegraldefruticultura.com.co/';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  public getAll<T> (endpoint: string): Observable<T[]> {
    return this.httpClient.get<T[]>(`${API_URL}/${endpoint}`);
  }

  public get<T> (endpoint: string, id: string): Observable<T> {
    return this.httpClient.get<T>(`${API_URL}/${endpoint}/${id}`);
  }

  public post (endpoint: string, resource: { email: string; password: string; }): Observable<any> {
    return this.httpClient.post(`${API_URL}/${endpoint}`, resource);
  }
}
