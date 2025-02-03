import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class JsonParsePipe implements PipeTransform<string, any> {
  transform(value: string): any {
    try {
      // Attempt to parse the stringified JSON
      return JSON.parse(value);
    } catch (error) {
      // Throw a BadRequestException if parsing fails
      throw new BadRequestException('Invalid JSON string');
    }
  }
}
