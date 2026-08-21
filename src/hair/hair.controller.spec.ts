import { Test, TestingModule } from '@nestjs/testing';
import { HairController } from './hair.controller';

describe('HairController', () => {
  let controller: HairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HairController],
    }).compile();

    controller = module.get<HairController>(HairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
