import { Injectable,Post,UseGuards,Body, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Room from './room.entity';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import CreateRoomDto from './dto/createRoom.dto';
import { QueryUtil, Filter, Sort } from 'src/utils/query.utils';


@Injectable()
export class RoomService {
    constructor(  @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly queryUtil: QueryUtil){

    }

    async getAllRooms(page: number = 0,
        limit: number = 10,
        filters: Filter[] = [],
        sorts: Sort[] = [])
        {

        const qb = this.roomRepository.createQueryBuilder('Room'); 
        this.queryUtil.paginate(qb, page, limit);
        this.queryUtil.filter(qb, filters);
        this.queryUtil.sort(qb, sorts);
    
        const [data, total] = await qb.getManyAndCount();

        return {data,total}

    }

    @UseGuards(JwtAuthenticationGuard)
    createRoom(room:CreateRoomDto,userId:number){

       const newRoom = this.roomRepository.create({...room,userId})

       return this.roomRepository.save(newRoom)

    }




}
