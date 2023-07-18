import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../domain/User';
import {PasswordChangeDto} from '../domain/dto/PasswordChangeDto';
import {DomSanitizer} from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import {BannedUserDTO} from '../domain/dto/BannedUserDTO';
import {Report} from '../domain/Report';
import {ReportedUser} from '../domain/ReportedUser';
import {InGameRoles} from '../domain/dto/InGameRoles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  changePasswordUrl = 'http://localhost:9090/api/v1/auth/password-change';
  deleteUserUrl = 'http://localhost:9090/api/v1/auth/';
  baseURL = 'http://localhost:9090/api/v1/users'
  reportUrl = 'http://localhost:9090/api/v1/reports'
  adminUrl = 'http://localhost:9090/api/v1/admin'
  friendsUrl = 'http://localhost:9090/api/v1/friends'
  usersGroupUrl = "http://localhost:9090/api/v1/user-groups"
  chatUrl = "http://localhost:9090/api/v1/chat"
  reportedUsers:ReportedUser[];

  private pictureSubject = new Subject<any>();
  private reportedUsersSubject = new Subject<any>();

  constructor(private http: HttpClient, private sanitizer:DomSanitizer) {
  }

  changePassword(passwordChange: PasswordChangeDto): Observable<any> {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(passwordChange);
    return this.http.post(this.changePasswordUrl, body, {headers})
  }

  editUser(user:User): Observable<any>{
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(user);
  return this.http.put(this.baseURL,body,{headers});
  }

  getUser():Observable<User>{
    return this.http.get<User>(this.baseURL)
  }
  deleteUser():Observable<any>{
    return this.http.delete(this.deleteUserUrl);
  }
  getUserGroups() {
    return this.http.get<User>(this.usersGroupUrl)
  }

  joinGroup(groupId:number,inGameRole:InGameRoles){
    return this.http.patch<User>(this.usersGroupUrl + '/' + groupId,inGameRole,{ observe: 'response' });
  }


  leaveGroup(groupId: number) {
    const url = this.usersGroupUrl + '/' + groupId;
    return this.http.delete(url);
  }

  getProfile(userId:number){
    return this.http.get(this.baseURL+'/profile/'+userId)
  }

  uploadProfilePicture(file:any):Observable<any>{
    const formData = new FormData();
    formData.append('profilePicture',file,file.name);
    return this.http.post(this.baseURL+'/profile/picture',formData)
  }
  getProfilePicture(userId:number):Observable<any>{
    return this.http.get(this.baseURL+'/profile/picture/'+userId,{responseType: 'blob'});
  }
  prepareProfilePicture(data:any){
    if (data.size===0) {
      return '../assets/img/default-avatar.png';
    } else {
      const newImage = URL.createObjectURL(data);
      return this.sanitizer.bypassSecurityTrustUrl(newImage);
    }
  }

  setReportedUsers(reportedUsers){
    this.reportedUsers = reportedUsers;
    this.reportedUsersSubject.next(reportedUsers);
  }

  getReportedUsersFromService(){
    return this.reportedUsers;
  }

  lookForReportUpdate():Observable<any>{
    return this.reportedUsersSubject.asObservable();
  }


  setProfilePicture(data:any){
    console.log(data)
    if (data.size===0) {
      this.pictureSubject.next('../assets/img/default-avatar.png');
      return '../assets/img/default-avatar.png';
    } else {
      const newImage = URL.createObjectURL(data);
      this.pictureSubject.next(this.sanitizer.bypassSecurityTrustUrl(newImage));
      return this.sanitizer.bypassSecurityTrustUrl(newImage);
    }
  }

  observeProfilePictureChange():Observable<any>{
    return this.pictureSubject.asObservable();
  }

  getUserByUsername(username:string){
    return this.http.get(this.baseURL+'/'+username)
  }

  reportUser(report:Report,userId:number){
    return this.http.post(this.reportUrl+'/'+userId,report)
  }

  getBannedUsers(){
    return this.http.get(this.adminUrl+'/users/banned')
  }

  unbanUser(id:number){
    return this.http.patch(this.adminUrl+'/users/banned/'+id,null)
  }

  banUser(id:number, reason:string){
    return this.http.put(this.adminUrl+'/banned',{id,reason})
  }

  getUserChatLogs(userId:number){
    return this.http.get(this.chatUrl+'/user/logs/'+userId)
  }

  getReportedUsers(){
    return this.http.get(this.adminUrl+'/users/reported')
  }
  deleteReports(user){
    return this.http.delete(this.reportUrl+'/'+user.id)
  }

  sendFriendRequest(user){
    return this.http.post(this.friendsUrl+'/requests/'+user.id,{})
  }

  getFriendRequests(){
    return this.http.get(this.friendsUrl+'/requests')
  }

  acceptFriendRequest(requestId:number){
    return this.http.put(this.friendsUrl+'/requests/accept/'+requestId,{})
  }
  declineFriendRequest(requestId:number){
    return this.http.put(this.friendsUrl+'/requests/decline/'+requestId,{})
  }

  getFriends(){
    return this.http.get(this.friendsUrl+'/')
  }

  setMessagesAsRead(chatId:number){
    return this.http.patch(this.chatUrl+"/messages/"+chatId,{})
  }

  countUnreadMessages(){
    return this.http.get(this.chatUrl+"/messages")
  }

  getChatMessages(chatId){
    return this.http.get(this.chatUrl+"/"+chatId)
  }

  removeFriend(friendId:number){
    return this.http.delete(this.friendsUrl+"/"+friendId);
  }


}

