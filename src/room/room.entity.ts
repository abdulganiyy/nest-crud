import { Column, Entity, PrimaryGeneratedColumn,ManyToOne } from 'typeorm';
import User from 'src/user/user.entity';
 
@Entity()
class Room {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public name: string;
 
  @Column()
  public capacity: number;

  @ManyToOne(() => User, (user)=> user.rooms)
  public userId: number;
}
 
export default Room;