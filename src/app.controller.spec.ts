import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { I18nService } from 'nestjs-i18n';

describe('AppController', () => {
  let appController: AppController;
  let i18n: I18nService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    i18n = app.get<I18nService>(I18nService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const expectedMessage = i18n.t('common.hello');

      expect(appController.getHello()).toBe(expectedMessage);
    });
  });
});
