import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { I18nService } from 'nestjs-i18n';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let i18n: I18nService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    i18n = moduleFixture.get<I18nService>(I18nService);
  });

  it('/ (GET)', () => {
    const expectedMessage = i18n.t('common.hello');

    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(expectedMessage);
  });

  afterEach(async () => {
    await app.close();
  });
});
