import {User} from "./User";
import {Message} from "./Message";
import {Category} from './Category';
export class GroupRoom{
  public id: number;
  public name: string;
  public description: string;
  public users: User[];
  public groupLeader: User;
  public chat: Message[];
  public category:Category;
}
