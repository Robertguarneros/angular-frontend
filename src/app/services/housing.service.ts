import { Injectable } from '@angular/core';
import { IHousing } from '../models/housing';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  token: string | null = null;
  newURL: string = '';

  constructor(private http:HttpClient, private authService:AuthService) { }

  url: string = "http://127.0.0.1:3000";

  getToken() {
    this.token = this.authService.getToken();
  }

  getHeaders() {
    this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('x-access-token', this.token || '');
    return headers;
  }

  createHouse(newHouse : IHousing|undefined) {
    return this.http.post<IHousing>(this.url+'/housing',newHouse, { headers: this.getHeaders() });
  }

  getHouse(findHouse : string){
    return this.http.get<IHousing>(this.url+'/housingadmin/'+findHouse, { headers: this.getHeaders() });
  }

  getHouses(page: number = 1, pageSize: number = 20) {
    this.newURL = `${this.url}/usersadmin?page=${page}&pageSize=${pageSize}`
    return this.http.get<IHousing[]>(this.newURL +'/housingadmin', { headers: this.getHeaders() });
  }

  updateHouse(editHouse : IHousing) {
    return this.http.put<IHousing>(this.url+'/housing/'+ editHouse._id, editHouse, { headers: this.getHeaders() });
  }

  deleteHouse(deleteHouseId : string) {
    return this.http.delete(this.url+'/housing/'+ deleteHouseId, { headers: this.getHeaders() });
  }
}
