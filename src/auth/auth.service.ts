import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { user } from '@prisma/client';
import * as bcrypt from "bcrypt"
import {  JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResDto } from './dto/login.res.dto';
import { refreshToken } from './dto/refreshToken.dto';
@Injectable()
export class AuthService {
  constructor(private readonly userService:UsersService,private readonly jwtModule:JwtService,private readonly configService:ConfigService ){}
async validateUser(email:string,password:string):Promise<user>{
    const user=await this.userService.findByEmail(email)    
      if (!user){
      console.log("user not found")
      throw new UnauthorizedException("email or password is incorrect")
    }
    const isAuth=await  bcrypt.compare(password,user.password)
    if (!isAuth){
      throw new UnauthorizedException("email or password is incorrect")
    }
    return user
  }
   login(user:user):LoginResDto{
    console.log()
   const payload={id:user.id}
   const AccesToken=this.jwtModule.sign(payload,{
      secret:this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN')    })
    const refreshToken=this.jwtModule.sign(payload,{
      expiresIn:this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      secret:this.configService.get('REFRESH_TOKEN_SECRET')
    })
   return {AccessToken:AccesToken,RefreshToken:refreshToken,user:user}
  }
  async validateRefreshToken(token:string):Promise<refreshToken>{
   const payload= this.jwtModule.verify(token,{
    secret:this.configService.getOrThrow('REFRESH_TOKEN_SECRET') 
   },)
    console.log(payload)
    const newPayload={id:payload.id}
   const newAccessToken=this.jwtModule.sign(newPayload,{
   secret:this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    expiresIn:this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN')

   })
   const newRefreshToken=this.jwtModule.sign(newPayload,{   
    expiresIn:this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN'),
    secret:this.configService.getOrThrow('REFRESH_TOKEN_SECRET')
    })
  return {accessToken:newAccessToken,refreshToken:newRefreshToken}
  }
   

}
