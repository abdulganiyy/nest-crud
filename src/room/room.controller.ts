import { Controller,Post,UseGuards,Body ,Get,Query,Req } from '@nestjs/common';
import { RoomService } from './room.service';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import CreateRoomDto from './dto/createRoom.dto';
import { Filter,Sort } from 'src/utils/query.utils';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ApiBearerAuth,ApiQuery } from '@nestjs/swagger';

@Controller('rooms')
export class RoomController {

    constructor(private readonly roomService:RoomService){

    }

    @Get()
    @ApiQuery({ name: 'page',required:false, example:0})
    @ApiQuery({ name: 'limit',required:false,example:10 })
    @ApiQuery({ name: 'filters',required:false,example:[] })
    @ApiQuery({ name: 'sort',required:false,example:[] })

    async findAll(
      @Query('page') page: number = 0,
      @Query('limit') limit: number = 10,
      @Query('filters') filters: string = '[]',
      @Query('sort') sort: string = '[]'
    ){
      const parsedFilters: Filter[] = JSON.parse(filters);
      const parsedSort: Sort[] = JSON.parse(sort);
      return await this.roomService.getAllRooms(page, limit, parsedFilters, parsedSort);
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    // @ApiBody({type:CreateRoomDto})
    @ApiBearerAuth()
    async createRoom(@Body() room: CreateRoomDto,@Req() request:RequestWithUser) {
      const {user} = request;
      return this.roomService.createRoom(room,user.id);
    }
}
