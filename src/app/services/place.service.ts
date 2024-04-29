import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  token: string | null = null;

  constructor(private http:HttpClient, private authService:AuthService) { }

  url: string = "http://127.0.0.1:3000";
  //url: string = "http://147.83.7.158:3000";
  
  getToken() {
    this.token = this.authService.getToken();
  }

  getHeaders() {
    this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('x-access-token', this.token || '');
    return headers;
  }

  createPlace(newPlace : Place |undefined) {
    return this.http.post<Place>(this.url+'/place',newPlace,{ headers: this.getHeaders() });
  }

  getPlace(findPlace : string){
    return this.http.get<Place>(this.url+'/place/'+findPlace, { headers: this.getHeaders() });
  }

  getPlaces() {
    return this.http.get<Place[]>(this.url+'/place', { headers: this.getHeaders() });
  }
  
  getPlacesAdmin(){
    return this.http.get<Place[]>(this.url+'/place/admin', { headers: this.getHeaders() });
  }

  updatePlace(editPlace : Place) {
    return this.http.put<Place>(this.url+'/place/'+ editPlace._id, editPlace, { headers: this.getHeaders() });
  }
  
  deletePlace(deletePlaceId : string) {
    return this.http.delete(this.url+'/place/'+ deletePlaceId, { headers: this.getHeaders() });
  }
}
