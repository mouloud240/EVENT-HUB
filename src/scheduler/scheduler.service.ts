/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { rsvp, rsvpStatus } from '@prisma/client';
import { prismaService } from 'src/db/prisma.service';
import { IMailerService } from 'src/mailer/mailer.service';
//TODO refactor this by imporivng the intervals checks
//TODO reafctor this by adding a check to the db if the userWere notified

//TODO there is a problem with the date fetching in the first cron job figure it out
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
    const dateDiff = date2.getTime() - date1.getTime();
    const days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }
  @Cron(CronExpression.EVERY_12_HOURS)
  async sendMailToAllEventParticipants() {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const events = await this.db.event.findMany({
      include: {
        rsvps: {
          include: { user: true },
        },
      },
      where: {
        date: {
          gte: utcNow,        },
      },
    });
    console.log(events);
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
      console.log(confirmedParticipants);
      const unconfirmedParticipants = event.rsvps
        .filter((rsvp) => rsvp.status === rsvpStatus.PENDING)
        .map((rsvp) => rsvp.user.email);
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
      if (days == 7) {
        this.mailerService.sendMailToMultiple(confirmedParticipants, {
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 week`,
        });
      }
      if (days < 7) {
        this.mailerService.sendMailToMultiple(confirmedParticipants, {
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in less than a week be prepared`,
        });
        this.mailerService.sendMailToMultiple(unconfirmedParticipants, {
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in less than a week confirm your RSVP`,
        });
      }
    });
    // send mail to all event participants
  }
  @Cron(CronExpression.EVERY_12_HOURS)
  async sendMailToEventCreator() {
    const events = await this.db.event.findMany({
      select: {
        createdBy: true,
        date: true,
        name: true,
        _count: {
          select: {
            rsvps: { where: { status: rsvpStatus.ACCEPTED } },
          },
        },
        capacity: true,
      },
      where: {
        date: {
          gte: new Date(),
        },
      },
    });
    events.map((event) => {
      if (event._count.rsvps == event.capacity) {
        this.mailerService.sendMailParticuler({
          to: event.createdBy.email,
          subject: 'Event Full',
          body: `Event ${event.name} is full Prepare yourself for the event`,
        });
      }
      const { days, hours, minutes, seconds } = this.getdatesdiffrence(
        new Date(),
        event.date,
      );
      if (days === 0 && hours === 1 && minutes === 0 && seconds === 0) {
        this.mailerService.sendMailParticuler({
          to: event.createdBy.email,
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 hour`,
        });
      }
      if (days === 1 && hours === 0 && minutes === 0 && seconds === 0) {
        this.mailerService.sendMailParticuler({
          to: event.createdBy.email,
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 day Prepare yourself for the event`,
        });
      }
      if (days <= 7) {
        this.mailerService.sendMailParticuler({
          to: event.createdBy.email,
          subject: 'Event Reminder',
          body: `Event ${event.name} is starting in 1 week Prepare yourself for the event`,
        });
      }
    });
  }
}
