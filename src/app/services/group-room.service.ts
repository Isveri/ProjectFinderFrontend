import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Message} from '../domain/Message';
import {GameDTO} from '../domain/dto/GameDTO';

@Injectable({
  providedIn: 'root'
})
export class GroupRoomService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private httpClient: HttpClient) { }

  getGroups(): Observable<GroupRoom[]> {

    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/all');
  }

  deleteGroup(groupId: number) {
    const url = this.baseUrl + '/groups/' + groupId;

    return this.httpClient.delete(url);
  }

  addGroup(newGroup: GroupRoom) {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(newGroup);
    return this.httpClient.post<GroupRoom>(this.baseUrl + '/groups/add',body,{headers});
  }

  deleteMessage(messageId: number) {
    const url = this.baseUrl + '/groups/comment/'+messageId;
    return this.httpClient.delete(url);
  }

  showGroupContent(groupId:number):Observable<GroupRoom>{
    return this.httpClient.get<GroupRoom>(this.baseUrl+'/groups/' + groupId)
  }

  addMessage(newMessage: Message){
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(newMessage);
    return this.httpClient.post<Message>(this.baseUrl+'/groups/newComment',body,{headers});
  }

  getGroupsByGame(game: string) {
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/all/'+game);
  }

  getGroupsByGameAndCategory(gameId:number,categoryId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&C/'+gameId+'/'+categoryId)
  }

  getGroupsByGameAndRole(gameId:number,roleId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&R/'+gameId+'/'+roleId)
  }

  getGroupsByGameCategoryRole(gameId:number,categoryId:number,roleId:number){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/groups/G&C&R/'+gameId+'/'+categoryId+'/'+roleId)
  }

  setIsPrivateValue(groupId:number,value:boolean){
    return this.httpClient.patch(this.baseUrl+'/groups/changeVisibility/'+groupId+'/'+value,{})
  }

}
