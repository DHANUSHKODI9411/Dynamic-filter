import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicFilterService {

  private baseUrl = "http://localhost:5180/api/data";

  constructor(private http: HttpClient) { }

  // call backend filter API
  getFilteredData(params: any) {
    return this.http.get(`${this.baseUrl}/filter`, { params });
  }

  // initial load

  getData(dataset: string) {
    return this.http.get(`${this.baseUrl}/${dataset}`);
  }

  // call backend sort API
  getSortedData(params: any) {
    return this.http.get(`${this.baseUrl}/sort`, { params });
  }
   // call backend multi-filter API
  getMultiFilteredData(payload: any) {
  return this.http.post(`${this.baseUrl}/multi-filter`, payload);
}

}