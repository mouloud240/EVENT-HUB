import { HttpException, Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { async } from 'rxjs';

@Injectable()
export class AppService {
  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  firebaseConfig = {
    apiKey: 'AIzaSyAIJN12Q8p0oCBPQRE0jJqWnpgfYIeHq9w',

    authDomain: 'taskmanager-91156.firebaseapp.com',

    projectId: 'taskmanager-91156',

    storageBucket: 'taskmanager-91156.appspot.com',

    messagingSenderId: '248788476270',

    appId: '1:248788476270:web:88772ea21ca7ee6a57e17f',

    measurementId: 'G-VCJDM4MMSK',
  };

  // Initialize Firebase

  app = initializeApp(this.firebaseConfig);
  Storage = getStorage(this.app);
  storageref = ref(this.Storage, 'eventHub/');

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
