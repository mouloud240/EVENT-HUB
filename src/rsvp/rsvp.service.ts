import { Injectable } from '@nestjs/common';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { UpdateRsvpDto } from './dto/update-rsvp.dto';

@Injectable()
export class RsvpService {
  create(createRsvpDto: CreateRsvpDto) {
    return 'This action adds a new rsvp';
  }

  findAll() {
    return `This action returns all rsvp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rsvp`;
  }

  update(id: number, updateRsvpDto: UpdateRsvpDto) {
    return `This action updates a #${id} rsvp`;
  }

  remove(id: number) {
    return `This action removes a #${id} rsvp`;
  }
}
