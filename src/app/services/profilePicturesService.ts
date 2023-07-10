import {Injectable} from '@angular/core';
import {GameDTO} from '../domain/dto/GameDTO';
import {HttpClient} from '@angular/common/http';
import {UserService} from './user.service';
import {GroupRoom} from '../domain/GroupRoom';
import {Friend} from '../domain/Friend';

@Injectable({providedIn: 'root'})
export class ProfilePicturesService {

  url = 'http://localhost:9090/api/v1/users/profile/picture';
  usersProfilePictures = new Map();

  constructor(private http: HttpClient, private userService:UserService) {
  }

  setUsersProfilePictures(groupRooms:GroupRoom[]){
    groupRooms.forEach((groupRoom)=>
    groupRoom.users.forEach((user)=>{this.userService.getProfilePicture(user.id).subscribe((data:any)=>{
      this.usersProfilePictures.set(user.id,this.userService.prepareProfilePicture(data));
    })}))
  }
  setUsersProfilePictureForGroup(groupRoom:GroupRoom){
    groupRoom.users.forEach((user)=>{this.userService.getProfilePicture(user.id).subscribe((data:any)=>{
      this.usersProfilePictures.set(user.id,this.userService.prepareProfilePicture(data));
    })})
  }
  getUsersProfilePictures(){
    return this.usersProfilePictures;
  }
  setProfilePicturesForFriends(friendList:Friend[]){
    friendList.forEach((friend)=>{
      this.userService.getProfilePicture(friend.user.id).subscribe((data:any)=>{
        this.usersProfilePictures.set(friend.user.id,this.userService.prepareProfilePicture(data))
      })
    })
  }
}
