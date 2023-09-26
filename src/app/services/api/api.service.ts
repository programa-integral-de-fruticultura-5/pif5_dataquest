import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly url = environment.url;

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

  public async post (endpoint: string, resource?: any): Promise<HttpResponse> {
    const result = await Preferences.get({ key: 'TOKEN_KEY' });
    const token = result.value
    const options = {
      url: `${this.url}/api/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: resource
    }

    return CapacitorHttp.post(options);
  }
}
