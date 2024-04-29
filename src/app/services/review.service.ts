import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Review } from '../models/review';
import { ObjectId } from 'mongoose';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  token: string | null = null;
  isloggedin: boolean | null = null;
  id: string | null = null;
  constructor(private http:HttpClient, private authService:AuthService) { }
  url: string = "http://127.0.0.1:3000";
  //url: string = "http://147.83.7.158:3000";

  getToken() {
    this.token = this.authService.getToken();
  }
  isLoggedIn(){
    return this.isloggedin = this.authService.isLoggedIn();
  }
  getUser() {
    return this.id = this.authService.getUser();
  }
  
  getHeaders() {
    this.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('x-access-token', this.token || '');
    return headers;
  }

  getReviews() {
    this.id = this.getUser();
    console.log('dentro reviews   '+this.id);
    
    return this.http.get<Review[]>(this.url+'/review/admin/'+this.id, { headers: this.getHeaders() });
  }
  getReviewsbyAuthor(id: string) {
    
    
    return this.http.get<Review[]>(this.url+'/review/byAuthor/'+id, {headers: this.getHeaders() });
  }
  getReviewsbyPlace(id: string|null) {
    
    return this.http.get<Review[]>(this.url+'/review/byPlace/'+id, { headers: this.getHeaders() });
  }
  getReviewsbyHousing(id: string|null) {
    
    return this.http.get<Review[]>(this.url+'/review/byHousing/'+id, {headers: this.getHeaders() });
  }
  createReview(newReview : Review |undefined) {
    return this.http.post<Review>(this.url+'/review',newReview, {headers: this.getHeaders() });
  }
  updateReview(editReview : Review) {
    return this.http.put<Review>(this.url+'/review/'+ editReview._id, editReview, { headers: this.getHeaders() });
  }
  deleteReview(deleteReviewId : string|null) {
    return this.http.delete(this.url+'/review/'+ deleteReviewId, { headers: this.getHeaders() });
    
    
  }
}
