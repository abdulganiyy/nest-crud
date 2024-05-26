import { Column, Entity, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import Room from 'src/room/room.entity';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public username: string;

  @Column({ unique: true })
  public email: string;
 
  @Column()
  public password: string;

  @OneToMany(() => Room, (room)=> room.userId)
  public rooms: number;
 

}
 
export default User;