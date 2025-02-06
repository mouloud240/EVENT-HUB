import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from 'src/db/prisma.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { prismaService } from 'src/db/prisma.service';

class constansts {
  static readonly result = [
    {
      name: 'Tech Conference 2025',
      description: 'A conference for tech enthusiasts and professionals.',
      id: '550e8400-e29b-41d4-a716-446655440000',
      city: 'San Francisco',
      long: -122.4194,
      lat: 37.7749,
      capacity: 500,
      date: new Date('2025-06-15T09:00:00.000Z'),
      UserId: '1a2b3c4d-5678-90ef-ghij-1234567890ab',
      coverPic: 'https://example.com/cover1.jpg',
      detailedPics: [
        'https://example.com/pic1.jpg',
        'https://example.com/pic2.jpg',
      ],
      createdAt: new Date('2025-02-01T12:00:00.000Z'),
      updatedAt: new Date('2025-02-01T12:00:00.000Z'),
    },
    {
      name: 'Music Festival 2025',
      description: 'An annual music festival featuring top artists.',
      id: '660f5c10-bcf1-4e3c-a6cd-1234567890cd',
      city: 'New York',
      long: -74.006,
      lat: 40.7128,
      capacity: 10000,
      date: new Date('2025-08-20T18:00:00.000Z'),
      UserId: '2b3c4d5e-6789-01ab-cdef-2345678901bc',
      coverPic: 'https://example.com/cover2.jpg',
      detailedPics: [
        'https://example.com/pic3.jpg',
        'https://example.com/pic4.jpg',
      ],
      createdAt: new Date('2025-02-02T14:30:00.000Z'),
      updatedAt: new Date('2025-02-02T14:30:00.000Z'),
    },
    {
      name: 'Startup Pitch Night',
      description: 'A networking event for startup founders and investors.',
      id: '770a6d20-cdf2-4f3d-b7de-3456789012de',
      city: 'Los Angeles',
      long: -118.2437,
      lat: 34.0522,
      capacity: 200,
      date: new Date('2025-07-10T17:30:00.000Z'),
      UserId: '3c4d5e6f-7890-12bc-def0-3456789012ef',
      coverPic: 'https://example.com/cover3.jpg',
      detailedPics: [
        'https://example.com/pic5.jpg',
        'https://example.com/pic6.jpg',
      ],
      createdAt: new Date('2025-02-03T16:45:00.000Z'),
      updatedAt: new Date('2025-02-03T16:45:00.000Z'),
    },
  ];
}
describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, prismaService],
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
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  const results = constansts.result;
  jest
    .spyOn(service, 'findAll')
    .mockImplementation(() => Promise.resolve(results));
  it('should return A list of Events', () => {
    expect(async () => await controller.findAll()).toBe(results);
  });
});
