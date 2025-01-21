import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { extendedRequest } from 'src/core/extendedRequest';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { rsvp, rsvpStatus } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';
import { RsvpEntity } from './entities/rsvp.dto';

//TODO add return types for the deletion
//TODO crete a specefic dto for pagination that conatins page number limit and the elements
@Controller('rsvp')
@ApiBearerAuth()
@UseGuards(jwtGuard)

export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}


  @ApiResponse({status:201,type:RsvpEntity})
  @Post()
  create(@Body() createRsvpDto: CreateRsvpDto, @Req() req:extendedRequest):Promise<rsvp> {
    
    return this.rsvpService.create(createRsvpDto,req.user.id);
  }

  @Get('Test')
  test(@Query() query:any){
    console.log(query)
    return "this is test"
  }
  @ApiResponse({status:200,type:Array<RsvpEntity>})
  @ApiProperty({description:"Get all of the Rsvps of the logged User"})
  @Get()
  findAll(@Req() req:extendedRequest):Promise<Array<rsvp>> {
    return this.rsvpService.findAllUserRsvps(req.user.id);
  }
  @ApiResponse({status:200,type:Array<RsvpEntity>})
  @Get('/user/pages')
  findAllPagination(@Req() req:extendedRequest ,@Query()query:PaginationDto):Promise<Array<rsvp>>{
    const {page=1,limit=10}=query
    return this.rsvpService.findAllUserRsvpsPagination(req.user.id,page,limit)
  }
  

  @Get('/event/:id')
  findAllevent(@Req() req:extendedRequest ,@Param('id') eventId:string ):Promise<Array<rsvp>> {
    return this.rsvpService.findAllEVentRsvps(eventId)
  }
  @Get('/event/pages/:id')
  findAllEventsRsvpsPerPage(@Req() req:extendedRequest  ,@Param(':id') id:string,@Query('page') page:number,@Query('limit') limit:number,):Promise<Array<rsvp>> {
    return this.rsvpService.findAllEventsRvpsPagination(id,page,limit)

  }
  @Get(':id')
  findOne(@Param('id') id: string):Promise<rsvp> {
    return this.rsvpService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRsvpDto: UpdateRsvpDto):Promise<{message:string}> {
    return this.rsvpService.update( updateRsvpDto,id);
  }
  @Patch('/user')
  updateAllUsersRsvp(@Body() body:{status:rsvpStatus} ,@Req() req:extendedRequest):Promise<{message:string}>{
    return this.rsvpService.updateAllUsersRsvp(body,req.user.id)
    
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rsvpService.remove(id);
  }
  @Delete('/event/:id')
  removeEventRsvp(@Param('id') id: string) {
    return this.rsvpService.removeEventRsvp(id);
  }
}
