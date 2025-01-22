/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { rsvp, rsvpStatus } from '@prisma/client';
import { prismaService } from 'src/db/prisma.service';
import { IMailerService } from 'src/mailer/mailer.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly mailerService: IMailerService,
    private readonly db: prismaService,
  ) {}
  getdatesdiffrence(
    date1: Date,
    date2: Date,
  ): { days: number; hours: number; minutes: number; seconds: number } {
    const dateDiff = date1.getTime() - date2.getTime();
    const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }

  async sendMailToAllEventParticipants() {
    const events = await this.db.event.findMany({
      include: {
        rsvps: {
          include: { user: true },
        },
      },
      where: {
        date: {
          gte: new Date(),
        },
      },
    });
    events.map((event) => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const { days, hours, minutes, seconds } = this.getdatesdiffrence(
        now,
        eventDate,
      );
      const confirmedParticipants = event.rsvps
        .filter((rsvp) => rsvp.status == rsvpStatus.ACCEPTED)
        .map((rsvp) => rsvp.user.email);
      const unconfirmedParticipants = event.rsvps
        .filter((rsvp) => rsvp.status === rsvpStatus.PENDING)
        .map((rsvp) => rsvp.UserId);
      if (days === 1 && hours === 0 && minutes === 0 && seconds === 0) {
        this.mailerService.sendMailToMultiple(confirmedParticipants, {
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 day`,
        });
      }
      if (days === 0 && hours === 1 && minutes === 0 && seconds === 0) {
        this.mailerService.sendMailToMultiple(confirmedParticipants, {
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 hour`,
        });
      }
    });
    // send mail to all event participants
  }
  async sendMailToConfirmRsvp() {}
  async sendMailToEventCreator() {}
}
