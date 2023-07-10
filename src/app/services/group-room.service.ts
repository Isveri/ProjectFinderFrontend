import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GroupRoom} from '../domain/GroupRoom';
import {Message} from '../domain/Message';
import {GameDTO} from '../domain/dto/GameDTO';
import {Page} from '../domain/dto/Page';
import {SearchCriteria} from '../domain/SearchCriteria';

@Injectable({
  providedIn: 'root'
})
export class GroupRoomService {
  private baseUrl = 'http://localhost:9090/api/v1/groups';
  private chatUrl = "http://localhost:9090/api/v1/chat";

  constructor(private httpClient: HttpClient) { }

  getGroups(): Observable<GroupRoom[]> {

    return this.httpClient.get<GroupRoom[]>(this.baseUrl);
  }

  getDeletedGroups(){
    return this.httpClient.get<GroupRoom[]>(this.baseUrl+'/deleted')
  }

  deleteGroup(groupId: number) {
    const url = this.baseUrl + '/' + groupId;

    return this.httpClient.delete(url);
  }

  addGroup(newGroup: GroupRoom) {
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(newGroup);
    return this.httpClient.post<GroupRoom>(this.baseUrl,body,{headers});
  }
  showGroupContent(groupId:number):Observable<GroupRoom>{
    return this.httpClient.get<GroupRoom>(this.baseUrl+'/' + groupId)
  }

  getGroupsByGame(game: string,page: number,size:number) :Observable<Page> {
    return this.httpClient.get<any>(this.baseUrl+'/all/'+game+"?page="+page+"&size="+size);
  }

  getGroupsByCriteria(criteria:SearchCriteria,page:number,size:number):Observable<any>{
    const headers = {'content-type': 'application/json'}
    const body = JSON.stringify(criteria);
    return this.httpClient.post<any>(this.baseUrl+"/filter?page="+page+"&size="+size,body,{headers});
  }

  setIsPrivateValue(groupId:number,value:boolean){
    return this.httpClient.patch(this.baseUrl+'/visibility/'+groupId+'/'+value,{})
  }
  generateCode(groupId:number){
    return this.httpClient.get(this.baseUrl+'/code/'+groupId)
  }

  joinByCode(code:string){
    return this.httpClient.patch(this.baseUrl+'/code/'+code,{});
  }

  makePartyLeader(groupId:number,userId:number){
    return this.httpClient.patch(this.baseUrl+'/leader/'+groupId+'/'+userId,{})
  }

  removeFromGroup(groupId:number,userId:number){
    return this.httpClient.patch(this.baseUrl+'/user/'+groupId+'/'+userId,{})
  }

  getChatLogs(groupId:number){
    return this.httpClient.get(this.chatUrl+'/group/logs/'+groupId);
  }

  getDeletedChatLogs(groupId:number){
    return this.httpClient.get(this.chatUrl+"/group/logs/deleted/"+groupId)
  }

  editGroup(id:number, group:GroupRoom): Observable<any>{
    const headers={'content-type': 'application/json'}
    const body = JSON.stringify(group);
    return this.httpClient.put(this.baseUrl+'/'+id,body,{headers});
  }
}
