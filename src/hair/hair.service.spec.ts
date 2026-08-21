import { Test, TestingModule } from '@nestjs/testing';
import { HairService } from './hair.service';

describe('HairService', () => {
  let service: HairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HairService],
    }).compile();

    service = module.get<HairService>(HairService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
