import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  imports: [
    PrismaModule,
    FileUploadModule.register({
      apiKey: 'AIzaSyAIJN12Q8p0oCBPQRE0jJqWnpgfYIeHq9w',

      authDomain: 'taskmanager-91156.firebaseapp.com',

      projectId: 'taskmanager-91156',

      storageBucket: 'taskmanager-91156.appspot.com',

      messagingSenderId: '248788476270',

      appId: '1:248788476270:web:88772ea21ca7ee6a57e17f',

      measurementId: 'G-VCJDM4MMSK',
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
