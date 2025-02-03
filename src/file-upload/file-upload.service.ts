import { HttpException, Inject, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { IFirebaseConfig } from './interfaces/firebase.interface';

@Injectable()
export class FileUploadService {
  constructor(
    @Inject('CONFIG_OPTIONS') private readonly opts: IFirebaseConfig,
  ) {
    console.log('CONFIG_OPTIONS:', this.opts); // Debugging
  }

  firebaseConfig = this.opts;
  app = initializeApp(this.firebaseConfig);
  Storage = getStorage(this.app);
  storageref = ref(this.Storage, 'eventHub/');

  // Initialize Firebase

  async handlleFileUpload(file: Express.Multer.File, userId: string) {
    try {
      const eventRef = ref(this.storageref, `${userId}/${file.originalname}`);
      const UploadedRef = await uploadBytes(eventRef, file.buffer);
      const downloadUrl = await getDownloadURL(UploadedRef.ref);
      return downloadUrl;
    } catch (e) {
      console.log(e);
      throw new HttpException('error uploading file', 500);
    }
  }
}
