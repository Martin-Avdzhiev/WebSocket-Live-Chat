import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

@Injectable()
export class StringToJsonPipe implements PipeTransform {
  constructor(private readonly dtoClass: any) { }

  transform(value: any) {
    let parsedValue = value;

    if (typeof value === 'string') {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        throw new BadRequestException('Invalid JSON');
      }
    }

    const object = plainToInstance(this.dtoClass, parsedValue);
    const errors = validateSync(object);

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    return object;
  }
}