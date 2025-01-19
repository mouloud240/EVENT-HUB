import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class googleGuard extends AuthGuard('google'){
  async canActivate(context:any){

   console.log('google guard')
    const activate=( await super.canActivate(context) as boolean)    
    const request=context.switchToHttp().getRequest()
    await super.logIn(request)
    return activate;
  }
  
}
