import { Transform } from "class-transformer"
import { IsInt,Min } from "class-validator"

export class PaginationDto{
  @Transform((value)=>parseInt(value.value))
  @IsInt()
  @Min(1)
  page?:number
  @Transform((value)=>parseInt(value.value))
  @IsInt()
  @Min(0)

  limit?:number
}
