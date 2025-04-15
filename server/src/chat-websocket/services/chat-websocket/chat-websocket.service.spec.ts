import { Test, TestingModule } from '@nestjs/testing';
import { ChatWebsocketService } from './chat-websocket.service';

describe('ChatWebsocketService', () => {
  let service: ChatWebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatWebsocketService],
    }).compile();

    service = module.get<ChatWebsocketService>(ChatWebsocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
