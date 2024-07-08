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



const sequelizeMock = {
    transaction: jest.fn().mockImplementation(() => ({
        commit:   jest.fn(),
        rollback: jest.fn(),
    })),
} as unknown as jest.Mocked<Sequelize>;

describe('_publishController', () => {
    const imageFile = {} as jest.Mocked<Express.Multer.File>;
    const hookPosition = {} as Json;
    const panelReturn = { id: 0, index: 0 };
    const createHookeReturn = { id: 0, panel_set: 0 };
    const panelSetReturn = { author_id: 'id', id: 0 };

    // error happens in panel set creation, throw an error
    test('_createPanelSetController returns an error', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => { throw new Error('Author Id doesnt exist or some other error making panel set'); });
        const response = await _publishController(sequelizeMock)('author_id', imageFile, imageFile, imageFile, [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 1 } ]);
        expect(response).toBeInstanceOf(Error);
    });

    // error in image save 1, 2 or 3 thrown
    test('image save fails', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn);
        (createHook as jest.Mock).mockReturnValue(() => createHookeReturn);
        (_saveImageController as jest.Mock).mockResolvedValue(Error('Error saving image'));
        const response = await _publishController(sequelizeMock)('author_id', imageFile, imageFile, imageFile, [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 0 } ]);
        expect(response).toBeInstanceOf(Error);
    });


    test('invalid hook id, throws an error', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn);
        const response = await _publishController(sequelizeMock)('author_id', imageFile, imageFile, imageFile, [{ position: hookPosition, panel_index: 1000 } ]);
        expect(response).toBeInstanceOf(Error);
    });

    // if error happens return it
    test('error happens in one of the services', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => { throw new Error('Error creating panel'); });
        const response = await _publishController(sequelizeMock)('author_id', imageFile, imageFile, imageFile, [{ position: hookPosition, panel_index: 100 }, { position: hookPosition, panel_index: 1 } ]);
        expect(response).toBeInstanceOf(Error);
    });

    // successful return
    test('Successful Publish', async() => {
        (_createPanelSetController as jest.Mock).mockReturnValue(() => panelSetReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn);
        (createHook as jest.Mock).mockReturnValue(() => createHookeReturn);
        (_saveImageController as jest.Mock).mockResolvedValue({ id: 'id' });
        const response = await _publishController(sequelizeMock)('author_id', imageFile, imageFile, imageFile, [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 0 } ]);
        expect(response).toEqual({ success: 'Panel_Set successfully published. {"author_id":"id","id":0}{"id":0,"index":0}{"id":0,"index":0}{"id":0,"index":0}{"id":0,"panel_set":0}{"id":"id"}{"id":"id"}{"id":"id"}' });
    });

});
