# Event Hub
## Conception Document

### 1. **Overview**

**EventHub** is a lightweight platform that enables users to create, manage, and discover local events. Designed for community groups and small organizations, EventHub simplifies event coordination and participant management.

---

### 2. **System Architecture**

### **Tech Stack**:

- **Backend**: NestJS (Node.js framework)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT with refresh tokens
- **File Uploads**: Multer for event images
- **Email Notifications**: Nodemailer
- **API Documentation**: Swagger
- **Testing**: Jest
- **Deployment**: Docker, CI/CD pipeline

### **High-Level Diagram**:

```
Frontend (Optional)
    |
    v
Backend (NestJS)
    |
    v
Database (PostgreSQL)

```

---

### 3. **Features**

### **3.1. User Authentication**

- **Sign Up/Login**:
    - Email and password authentication.
    - Password hashing using Bcrypt.
- **JWT**:
    - Access and refresh tokens for authentication.

### **3.2. Event Management**

- Create, update, and delete events.
- Define event details: name, description, date, location, and capacity.
- Upload event images.

### **3.3. Event Discovery**

- Search and filter events by name, category, or date.
- Pagination for improved performance.

### **3.4. RSVP System**

- Users can RSVP to events.
- Enforce capacity limits.
- Option to cancel RSVP.

### **3.5. Notifications**

- Email confirmations for RSVPs.
- Event reminders sent closer to the event date.

### **3.6. API Design**

- **RESTful Endpoints**:
    - CRUD operations for users, events, and RSVPs.
    - Authentication endpoints for login, registration, and token refresh.
- **API Documentation**:
    - Use Swagger for detailed API specs.

### **3.7. Testing**

- Unit tests for services, controllers, and modules.
- End-to-end (e2e) tests for RSVP and event workflows.

---

### 4. **Database Design**

### **4.1. Entities**

1. **User**:
    - id (UUID)
    - name (string)
    - email (string, unique)
    - password (hashed string)
    - createdAt, updatedAt (timestamps)
2. **Event**:
    - id (UUID)
    - name (string)
    - description (string)
    - date (timestamp)
    - location (string)
    - capacity (integer)
    - createdBy (foreign key: User)
    - createdAt, updatedAt (timestamps)
3. **RSVP**:
    - id (UUID)
    - eventId (foreign key: Event)
    - userId (foreign key: User)
    - createdAt (timestamp)

### **4.2. Relationships**

- **User - Event**: One-to-Many (creator).
- **Event - RSVP**: One-to-Many.
- **User - RSVP**: One-to-Many.

---

### 5. **Backend Implementation**

### **5.1. Modules**

1. **AuthModule**:
    - Handles user registration, login, and token generation.
2. **EventModule**:
    - CRUD operations for events.
    - Manage event capacity and RSVP logic.
3. **RSVPModule**:
    - Tracks user RSVPs and capacity enforcement.

### **5.2. Middleware**

- **AuthMiddleware**: Validates JWT tokens for protected routes.

### **5.3. Services**

- Handle business logic for event creation, RSVPs, and notifications.

### **5.4. Testing**

- Write unit tests for services and controllers.
- Integration tests for RSVP and event workflows.

---

### 6. **Deployment Plan**

### **6.1. Docker Configuration**

- Create Dockerfiles for backend and database.
- Use Docker Compose to orchestrate services.

### **6.2. CI/CD**

- Set up GitHub Actions for automated testing and deployment.
- Deploy to cloud platforms like AWS, GCP, or Azure.

---

### 7. **Timeline**

### **Week 1(19Jan)**:

- Set up NestJS project structure.
- Implement user authentication.

### **Week 2**:

- Develop event management module.
- Set up PostgreSQL with Prisma.

### **Week 3**:

- Implement RSVP module and notifications.

### **Week 4**:

- Write unit and e2e tests.
- Deploy the application using Docker.

---

### 8. **Future Enhancements**

- Add geolocation for event discovery.
- Support social sharing of public events.
- Expand notifications to include SMS reminders.

---

## What to learn:

- Nestjs ecoSystem +prisma
- Usage of multer
- Usage of Scheduled Tasks
- Passport auth
- Writing unit tests
- clean code (try to apply some of the stuff in the Data intensive book )
- usage of react Router in the client side

## Design Brief

**Project Name**: EventHub

**Goal**: Build a lightweight, user-friendly platform for managing and discovering local events with features like RSVP tracking and email notifications.

**Target Audience**: Community groups, local organizations, and event enthusiasts.

**Core Features**:

1. Secure user authentication.
2. Event creation and management.
3. RSVP system with capacity enforcement.
4. Event search and discovery.
5. Email notifications for RSVPs and reminders.

**Technology Stack**:

- Backend: NestJS
- Database: PostgreSQL
- File Uploads: Multer
- Email Notifications: Nodemailer

**Key Deliverables**:

1. Functional REST API with Swagger documentation.
2. Fully tested backend modules.
3. Dockerized application ready for deployment.

**Timeline**: 4 weeks

**Future Potential**: Geolocation, social sharing, SMS reminders.
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod


#check api docs
localhost:3000/docs 
```


## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
