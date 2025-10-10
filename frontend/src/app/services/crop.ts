import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CropService {
  private apiUrl = 'http://localhost:3000/api'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Method to fetch all crops from the API
  getAllCrops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/crops`);
  }

  // Method to fetch a single crop by ID
  getCropById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/crops/${id}`);
  }

  // Method to delete crop
  deleteCrop(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/crops/${id}`);
  }

  // Method to total crop
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/totals`);
  }

  // Method to add crop
  addCrop(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crops`, formData);
  }

}
