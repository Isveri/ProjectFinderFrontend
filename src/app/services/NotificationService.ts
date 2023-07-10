import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';

@Injectable({providedIn: 'root'})
export class NotificationService {

  url = 'http://localhost:9090/api/v1/notification';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  public getAllNotifications(){
    return this.http.get(this.url)
  }

  public removeNotification(notifId){
    return this.http.delete(this.url+'/'+notifId)
  }
}
