import {InGameRoles} from './InGameRoles';
import {Platform} from '../Platform';

export class UserDTO{
  public id:number;
  public username:string;
  public name:string;
  public info:string;
  public age:string;
  public email:string;
  public phone:string;
  public city:string;
  public inGameRoles: InGameRoles[];
  public platforms:Platform[];
}
