import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prismaService } from 'src/db/prisma.service';
import * as bcrypt from "bcrypt"
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
@Injectable()
export class UsersService {
  constructor(private readonly db:prismaService){}
  async create(createUserDto: CreateUserDto) {
    const user={...createUserDto}  
    try {
 //TODO: change the hash to more in prod
    const hashedPassword=await bcrypt.hash(user.password,5)
      user.password=hashedPassword
    return  this.db.user.create({
      data:user
    })
    }catch(error){
     if (error instanceof PrismaClientValidationError){
     throw new HttpException(error,HttpStatus.BAD_REQUEST)
      } 
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR) 
    }
    
      }

  findAll() {
try  {   
      return  this.db.user.findMany(
        {
          select:{
            name:true,
            email:true,
            id:true
          }
        } 
      )
    }  catch(error){
  throw new HttpException(error,HttpStatus.BAD_REQUEST)
  }
  }
  async findOne(id: string) {
    try{
  const user=await  this.db.user.findFirst({
      where:{
        id:id

      }
 
    }
              );
  if(!user){
        throw new HttpException("user not found",HttpStatus.NOT_FOUND)
        }
      return user

    }
    catch(error){
      
     throw new HttpException(error,HttpStatus.BAD_REQUEST)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
try  {     const userData={...updateUserDto}
      if (userData.password){
        //TODO: change the hash to more in prod
        userData.password=await bcrypt.hash(userData.password,5) 
      }
      return this.db.user.update({
        where:{
          id:id
        },
        data:updateUserDto
      });
    }catch(e){
      throw new HttpException(e,HttpStatus.BAD_REQUEST)
    }  }

  remove(id: string) {
  try{     return this.db.user.delete({
      where:{
        id:id
      }
    }) ;
    }catch(e){
      throw new HttpException(e,HttpStatus.INTERNAL_SERVER_ERROR)
    }  }
  async findByEmail(email:string){
    try{
    return this.db.user.findFirst({
      where:{
        email:email
      }
    })
    }catch(e){
      throw new HttpException(e,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
}

