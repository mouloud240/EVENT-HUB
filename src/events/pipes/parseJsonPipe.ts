
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        throw new BadRequestException('Invalid JSON string');
      }
    }
    return value; // Already an object, return as is
  }
}

