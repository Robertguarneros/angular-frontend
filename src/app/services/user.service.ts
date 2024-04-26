import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  createUser(newUser : User |undefined) {
    return this.http.post<User>(this.url+'/users',newUser);
  }

  loginUser(email:string, password:string) {// we need to complete the function
    return this.http.post<any>(this.url+'/login',{email, password});
  }

  getUser(findUser : string){
    return this.http.get<User>(this.url+'/usersadmin/'+findUser, { headers: this.getHeaders() });
  }

  getUsers(page: number = 1, pageSize: number = 20) {
    this.newURL = `${this.url}/usersadmin?page=${page}&pageSize=${pageSize}`;

    return this.http.get<User[]>(this.newURL, { headers: this.getHeaders() });
  }

  updateUser(editUser : User) {
    return this.http.put<User>(this.url+'/users/'+ editUser._id, editUser, { headers: this.getHeaders() });
  }
  
  deleteUser(deleteUserId : string) {
    return this.http.delete(this.url+'/users/'+ deleteUserId, { headers: this.getHeaders() });
  }

}
