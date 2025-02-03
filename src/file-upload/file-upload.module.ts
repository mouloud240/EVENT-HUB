import { Module, DynamicModule } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { IFirebaseConfig } from './interfaces/firebase.interface';

@Module({})
export class FileUploadModule {
  static register(opts: IFirebaseConfig): DynamicModule {
    return {
      module: FileUploadModule,
      providers: [
        { provide: 'CONFIG_OPTIONS', useValue: opts },
        FileUploadService,
      ],
      exports: [FileUploadService],
    };
  }
}
