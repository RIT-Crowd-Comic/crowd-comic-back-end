import { Sequelize } from 'sequelize';
import { createPanel } from '../services/panelService';
import { _saveImageController } from '../requestHandlers/image';
import { _createPanelSetController } from '../requestHandlers/panelSet';
import { _publishController } from '../requestHandlers/publish';
import { Json } from 'sequelize/types/utils';
import { createHook } from '../services/hookService';
jest.mock('../services/panelService');
jest.mock('../services/hookService');
jest.mock('../requestHandlers/panelSet');
jest.mock('../requestHandlers/image');



let sequelizeMock = {
 transaction: jest.fn().mockImplementation(() => ({
      commit: jest.fn(),
      rollback: jest.fn(),
    })),
} as unknown  as jest.Mocked<Sequelize>

describe('_publishController', () => {
    let imageFile= {} as jest.Mocked<Express.Multer.File>;
    let hookPosition = {} as Json;
    const panelReturn1 = {id: 0, index: 0};
    const panelReturn2 = {id: 1, index: 1};
    const panelReturn3 = {id: 2, index: 2};
    const panelSetReturn = { author_id: 'id', id: 0 };
    
    //error happens in panel set creation, throw an error
    test('_createPanelSetController returns an error', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => { throw new Error('Author Id doesnt exist or some other error making panel set'); });
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 0}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toBeInstanceOf(Error);
    });

    //error in image save 1, 2 or 3 thrown
    test('1st image save fails', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn1);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn2);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn3);
        (createHook as jest.Mock).mockResolvedValue(() => {});
        (_saveImageController as jest.Mock).mockResolvedValue(Error('Error saving image'));
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 0}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toBeInstanceOf(Error);
    });

    test('2nd image save fails', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn1);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn2);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn3);
        (createHook as jest.Mock).mockResolvedValue(() => {});
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        (_saveImageController as jest.Mock).mockResolvedValue(Error('Error saving image'));
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 0}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toBeInstanceOf(Error);
    });

    test('3rd image save fails', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn1);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn2);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn3);
        (createHook as jest.Mock).mockResolvedValue(() => {});
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        (_saveImageController as jest.Mock).mockResolvedValue(Error('Error saving image'));
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 0}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toBeInstanceOf(Error);
    });

    //if error happens return it
    test('error happens in one of the services', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => {throw new Error('Error creating panel')});
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 100}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toBeInstanceOf(Error);
    });

    //successful return
    test('Successful Publish', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn1);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn2);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn3);
        (createHook as jest.Mock).mockResolvedValue(() => {});
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        const response = await _publishController(sequelizeMock)('author_id',imageFile, imageFile, imageFile, [{position : hookPosition,panel_index: 0}, {position : hookPosition,panel_index: 1} ] );
        expect(response).toEqual({ success: 'Panel_Set successfully published.'});
    });
  
});