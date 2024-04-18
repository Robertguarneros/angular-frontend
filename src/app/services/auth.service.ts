import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private id: string | null = null;
  private first_name: string | null = null;
  private middle_name: string | null = null;
  constructor() {}

  setToken(token: string) {
    this.token = token;
    console.log('dentro auth'+token);
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
  }
  setUserId(id: string) {
    this.id = id;
    console.log('dentro auth'+id);
    // Store token in localStorage for persistence
    localStorage.setItem('id', id);
  }
  setUserName(first_name: string) {
    this.first_name = first_name;
    //this.middle_name=middle_name;
    // Store token in localStorage for persistence
    localStorage.setItem('fisrt_name', first_name);
    //localStorage.setItem('middle_name', middle_name);
  }
  getUserName(): string |null {
    // Retrieve token from localStorage
    return localStorage.getItem('first_name');
  }
  getToken(): string | null {
    // Retrieve token from localStorage
    console.log('dentro auth get'+localStorage.getItem('token'));
    return localStorage.getItem('token');
  }
  getUser(): string |null {
    // Retrieve token from localStorage
    return localStorage.getItem('id');
  }
  isLoggedIn(): boolean {
    // Check if token exists
    return this.getToken() !== null;
  }

  logout() {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('first_name');
    //localStorage.removeItem('middle_name');
    this.token = null;
    this.id = null;
    this.first_name = null;
    //this.middle_name=null;
  }
}
