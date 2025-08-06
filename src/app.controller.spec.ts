import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResponseDTO } from './shared/dto/response.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getPing: jest.fn().mockReturnValue({
              error: false,
              message: 'operacion Exitosa',
              response: {
                data: {
                  author: 'ARIEL TORRICOS PADILLA',
                  dateTimeServer: new Date(),
                  nameApp: 'Maestria_Software_Avanzado',
                  version: '0.0.1',
                },
              },
              status: 200,
            }),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('deberia retornar un respuesta correcta para controlar el ping', () => {
    const result: ResponseDTO<{
      author: string;
      dateTimeServer: Date;
      nameApp: string;
      version: string;
    }> = appController.getPing();

    expect(appService.getPing).toHaveBeenCalled();
    expect(result.response!.data!.author).toBe('ARIEL TORRICOS PADILLA');
    expect(result.response!.data!.nameApp).toBe('Maestria_Software_Avanzado');
    expect(result.response!.data!.version).toBe('0.0.1');
    expect(result.response!.data!.dateTimeServer).toBeInstanceOf(Date);
  });
});
