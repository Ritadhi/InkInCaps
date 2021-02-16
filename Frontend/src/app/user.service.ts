import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  photo: string;
  id: string;

  token:String = "MY_TOKEN"

  header = new HttpHeaders({'Authorization': 'Bearer ' + this.token});

  url: string = "http://127.0.0.1:3000/users"

  constructor(private _http:HttpClient) { }

  addLeader(body:any) {
    return this._http.post(this.url + '/addLeader', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  fetchLeaderBoard(body:any) {
    return this._http.post(this.url + '/fetchLeaderBoard', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  addStudent(body:any) {
    return this._http.post(this.url + '/addStudent', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  photos(body:File, id: String) {
    var formData: any = new FormData();
    formData.append("photo", body);
    formData.append("id", id);
    return this._http.post(this.url + '/photo', formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  profilePhoto(body: any){
    return this._http.post(this.url + '/profilePhoto', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  countStudent(){
    return this._http.get(this.url + '/countStudent', {
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  getStudent(body:any) {
    return this._http.post(this.url + '/getStudent', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  edit(body:any) {
    return this._http.post(this.url + '/edit', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

  deleteStudent(body:any) {
    return this._http.post(this.url + '/deleteStudent', body, {
      observe: 'body',
      withCredentials: true,
      headers: this.header.append('Content-Type', 'application/json')
    });
  }

}
