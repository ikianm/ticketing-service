import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose from 'mongoose';
import AppConfig from '../configs/app.config';
const path = require('node:path');
import { rimrafSync } from 'rimraf';

jest.setTimeout(30000);

const accessToken = `Bearer ${AppConfig().accessToken}`;

describe('end-2-end testing', () => {

    let app: INestApplication;

    beforeAll(async () => {

        await mongoose.connect(AppConfig().database.uri);
        await mongoose.connection.db.dropDatabase();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(done => {
        mongoose.connection.close();
        app.close();
        rimrafSync(path.resolve('public')); //deletes attachment's folder after running all tests
        done();
    });

    let groupId: string;
    let providerId: string;
    let ticketId: string;

    let invalidGroupId = 'abcdefg';
    let invalidProviderId = 'abcdefg'
    let invalidTicketId = 'abcdefg';
    let notExistinTicketId = '66c5825591068f46b2d5491e';

    describe('GroupsModule', () => {

        describe('CreateGroups', () => {
            const groupName = 'group one';

            it('creates new group', async () => {
                return await request(app.getHttpServer())
                    .post('/groups')
                    .set('Authorization', accessToken)
                    .send({ name: groupName })
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        const { message, data } = res.body;
                        groupId = data._id;
                        expect(message).toBeDefined();
                        expect(data._id).toBeDefined();
                        expect(data.name).toEqual(groupName);
                    });
            });

            it('should throw BadRequest (duplicate name)', async () => {
                return await request(app.getHttpServer())
                    .post('/groups')
                    .set('Authorization', accessToken)
                    .send({ name: groupName })
                    .expect(HttpStatus.BAD_REQUEST);
            });
        });


        describe('FindAll', () => {

            it('should return all groups', async () => {
                return await request(app.getHttpServer())
                    .get('/groups')
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res).toBeDefined();
                    })
            });
        });

    });

    describe('ProvidersModule', () => {

        describe('CreateProvider', () => {

            const providerName = 'provider one';

            it('should create a provider', async () => {
                return await request(app.getHttpServer())
                    .post('/providers')
                    .set('Authorization', accessToken)
                    .send({ name: providerName })
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        const { message, data } = res.body;
                        providerId = data._id;
                        expect(message).toBeDefined();
                        expect(data._id).toBeDefined();
                        expect(data.name).toEqual(providerName);
                    });
            });

            it('should throw BadRequest (duplicate name)', async () => {
                return await request(app.getHttpServer())
                    .post('/providers')
                    .set('Authorization', accessToken)
                    .send({ name: providerName })
                    .expect(HttpStatus.BAD_REQUEST)
            });
        });

        describe('FindAll Providers', () => {
            it('should return all providers', async () => {
                return await request(app.getHttpServer())
                    .get('/providers')
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.OK)
                    .then(res => {
                        expect(res).toBeDefined();
                    })
            });
        });

    });

    describe('TicketsModule', () => {

        describe('CreateTickets', () => {
            it('should create a ticket', async () => {
                return await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', groupId)
                    .field('providerId', providerId)
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        const { data, message } = res.body;
                        ticketId = data._id;
                        expect(message).toBeDefined();
                        expect(data.serial).toHaveLength(8);
                        expect(data.userId).toBeDefined();
                        expect(data.attachment).toBeDefined();
                    });
            });

            it('should throw BadRequest (invalid groupId)', async () => {
                return await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', invalidGroupId)
                    .field('providerId', providerId)
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('should throw BadRequest (invalid providerId)', async () => {
                return await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', groupId)
                    .field('providerId', invalidProviderId)
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('should throw PayloadTooLarge (attachment too large)', async () => {
                return await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', groupId)
                    .field('providerId', invalidProviderId)
                    .attach('attachment', path.resolve(__dirname, 'file2.jpg'))
                    .expect(HttpStatus.PAYLOAD_TOO_LARGE);
            });

            it('should throw UnsupportedMediaType (invalid extension type)', async () => {
                return await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', groupId)
                    .field('providerId', providerId)
                    .attach('attachment', path.resolve(__dirname, 'file3.js'))
                    .expect(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            });
        });

        describe('CloseTickets', () => {
            it('should close the ticket', async () => {
                return await request(app.getHttpServer())
                    .put(`/tickets/close/${ticketId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.OK)
                    .then(res => {
                        const { message, data } = res.body;
                        expect(message).toBeDefined();
                        expect(data.status).toBe(2);
                    });
            });


            it('should throw BadRequest (ticket already closed)', async () => {
                return await request(app.getHttpServer())
                    .put(`/tickets/close/${ticketId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('should throw BadRequest (invalid ticketId)', async () => {
                return await request(app.getHttpServer())
                    .put(`/tickets/close/${invalidTicketId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('should throw NotFound (ticket not found)', async () => {
                return await request(app.getHttpServer())
                    .put(`/tickets/close/${notExistinTicketId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.NOT_FOUND);
            });


        });
    });

    describe('CommentsModule', () => {
        let commentId: string;
        let invalidCommentId = 'abcdefg';
        let notExistingCommentId = '66c59d48c4994108f608a876';

        describe('CreateComment', () => {
            it('should create a comment', async () => {

                const { data } = await request(app.getHttpServer())
                    .post('/tickets')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('title', 'title of the ticket')
                    .field('issue', 'this is a short description of the issue')
                    .field('priority', 1)
                    .field('groupId', groupId)
                    .field('providerId', providerId)
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .then(res => res.body);

                return await request(app.getHttpServer())
                    .post('/comments')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('ticketId', data._id)
                    .field('content', 'this is the content of a comment related to a ticket')
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .expect(HttpStatus.CREATED)
                    .then(res => {
                        const { data, message } = res.body;
                        commentId = data._id;
                        expect(message).toBeDefined();
                        expect(data.seenByAdmin).toBeDefined();
                        expect(data.seenByUser).toBeDefined();
                    })
            });

            it('should throw BadRequest (ticket is closed)', async () => {
                return await request(app.getHttpServer())
                    .post('/comments')
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', accessToken)
                    .field('ticketId', ticketId)
                    .field('content', 'this is the content of a comment related to a ticket')
                    .attach('attachment', path.resolve(__dirname, 'file.png'))
                    .expect(HttpStatus.BAD_REQUEST)
            });

        });

        describe('SeenComment', () => {

            it('should be seenByUser', async () => {
                return await request(app.getHttpServer())
                    .put(`/comments/seenByUser/${commentId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.OK);
            });

            it('should throw BadRequest (invalid commentId)', async () => {
                return await request(app.getHttpServer())
                    .put(`/comments/seenByUser/${invalidCommentId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.BAD_REQUEST);
            });

            it('should throw NotFound (comment not found)', async () => {
                return await request(app.getHttpServer())
                    .put(`/comments/seenByUser/${notExistinTicketId}`)
                    .set('Authorization', accessToken)
                    .expect(HttpStatus.NOT_FOUND);
            });
        });
    });

});



