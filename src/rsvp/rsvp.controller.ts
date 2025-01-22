import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';
import { jwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { rsvp, rsvpStatus, user } from '@prisma/client';
import { PaginationDto, PaginationDtoRes } from './dto/pagination.dto';
import { RsvpEntity } from './entities/rsvp.dto';
import { currentUser } from 'src/auth/decorators/getUser.decorator';

//TODO add return types for the deletion
//TODO crete a specefic dto for pagination that conatins page number limit and the elements
@Controller('rsvp')
@ApiBearerAuth()
@UseGuards(jwtGuard)
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @ApiResponse({ status: 201, type: RsvpEntity })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createRsvpDto: CreateRsvpDto,
    @currentUser() user: user,
  ): Promise<rsvp> {
    return this.rsvpService.create(createRsvpDto, user.id);
  }

  @Get('Test')
  test(@Query() query: any) {
    console.log(query);
    return 'this is test';
  }
  @ApiResponse({ status: 200, type: Array<RsvpEntity> })
  @ApiProperty({ description: 'Get all of the Rsvps of the logged User' })
  @Get()
  findAll(@currentUser() user: user): Promise<Array<rsvp>> {
    return this.rsvpService.findAllUserRsvps(user.id);
  }
  @ApiResponse({ status: 200, type: PaginationDtoRes<RsvpEntity> })
  @Get('/user/pages')
  findAllPagination(
    @currentUser() user: user,
    @Query() query: PaginationDto,
  ): Promise<PaginationDtoRes<rsvp>> {
    const { page = 1, limit = 10 } = query;
    return this.rsvpService.findAllUserRsvpsPagination(user.id, page, limit);
  }

  @Get('/event/:id')
  findAllevent(
    @currentUser() user: user,
    @Param('id') eventId: string,
  ): Promise<Array<rsvp>> {
    return this.rsvpService.findAllEVentRsvps(eventId);
  }
  @Get('/event/pages/:id')
  findAllEventsRsvpsPerPage(
    @currentUser() user: user,
    @Param(':id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<PaginationDtoRes<rsvp>> {
    return this.rsvpService.findAllEventsRvpsPagination(id, page, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<rsvp> {
    return this.rsvpService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRsvpDto: UpdateRsvpDto,
  ): Promise<{ message: string }> {
    return this.rsvpService.update(updateRsvpDto, id);
  }
  @Patch('/user')
  updateAllUsersRsvp(
    @Body() body: { status: rsvpStatus },
    @currentUser() user: user,
  ): Promise<{ message: string }> {
    return this.rsvpService.updateAllUsersRsvp(body, user.id);
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
