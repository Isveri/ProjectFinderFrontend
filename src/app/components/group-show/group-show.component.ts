import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';
import {GroupRoomService} from '../../services/group-room.service';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Message} from '../../domain/Message';
import {JoinCodeDTO} from '../../domain/dto/JoinCodeDTO';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {AuthService} from '../../services/auth.service';
import {CodeErrors} from '../../providers/CodeErrors';

declare let EventSource:any;

@Component({
  selector: 'app-group-show',
  templateUrl: './group-show.component.html',
  styleUrls: ['./group-show.component.scss']
})
export class GroupShowComponent implements OnInit,OnDestroy {
  id:number = history.state.data;
  currentGroup:GroupRoom;
  profilePictures = null;
  isUserInGroup = false;
  isConnected = new Map();

  isAdmin = false;
  public source;
  currentUser:User;
  constructor(private groupRoomService:GroupRoomService,
              private alertService:AlertService,
              private userService:UserService,
              private profilePicturesService:ProfilePicturesService,
              private authService:AuthService,
              private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.source = new EventSource('http://localhost:8080/api/v1/notify/test?token='+this.authService.getToken());
    this.source.addEventListener('message', message =>{
      const msg:Message = JSON.parse(message.data);
      if(msg.negative){
        this.alertService.error(msg.text);}
      else{
        this.alertService.success(msg.text)
      }
      this.checkIfAdmin();
      this.showGroupContent(this.id);
      if(msg.type==='REMOVED' && msg.groupId === this.currentGroup.id){
        router.navigateByUrl('/home-page')
      }
      window.setTimeout(()=> {
        this.alertService.clear()},8000);
    })


    }

  ngOnInit(): void {
    this.showGroupContent(this.id)
    this.checkIfAdmin();
  }

  ngOnDestroy() {
    this.source.close();
  }

  showGroupContent(groupId: number) {
    if(groupId===undefined){
      groupId = Number(localStorage.getItem('groupId'));
    }else{
      localStorage.setItem('groupId',groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data:any)=>
    { this.currentGroup = data;
      this.isUserInGroup = this.tableContains(data?.users,this.currentUser);
      this.profilePictures = this.profilePicturesService.getUsersProfilePictures();

      if(this.profilePictures.size===0){
        this.profilePicturesService.setUsersProfilePictureForGroup(data);
        this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
      }
    },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    )
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if ( this.currentUser?.role.name === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
        this.isUserInGroup = this.tableContains(this.currentGroup?.users,data);
      }, (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }
  public joinGroup(groupId:number){
    this.userService.joinGroup(groupId).subscribe((data:any) => {
        // this.alertService.success('You joined group');
        this.showGroupContent(groupId)
      },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  generateCode(groupRoom:GroupRoom){
    this.groupRoomService.generateCode(groupRoom.id).subscribe((data:any) =>
    { const joinCodedto:JoinCodeDTO = data;
      groupRoom.joinCode = joinCodedto?.code},(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }

  public makePartyLeader(user:User){
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.makePartyLeader(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public removeFromGroup(user:User){
    const userId=user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.removeFromGroup(groupId,userId).subscribe((data:any)=> this.currentGroup = data,
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public tableContains(table,objectToFind):boolean{
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for(let i=0; i<table.length;i++){
      if(table[i]?.id === objectToFind?.id){
        found = true;
        break;
      }
    }
    return found
  }

  public setConnection(values:any){
    this.isConnected.set(values[0],values[1]);
  }
}
