import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DynamicFilterService {

  constructor(private http: HttpClient) {}

  loadData(fileName: string) {
    return this.http.get<any[]>(`/${fileName}`);
  }
  
}

