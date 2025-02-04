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
      apiKey: process.env.FILE_UPLOAD_API_KEY,
      authDomain: process.env.FILE_UPLOAD_AUTH_DOMAIN,
      projectId: process.env.FILE_UPLOAD_PROJECT_ID,
      storageBucket: process.env.FILE_UPLOAD_STORAGE_BUCKET,
      messagingSenderId: process.env.FILE_UPLOAD_MESSAGING_SENDER_ID,
      appId: process.env.FILE_UPLOAD_APP_ID,
      measurementId: process.env.FILE_UPLOAD_MEASUREMENT_ID,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
