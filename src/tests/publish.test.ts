jest.mock('../services/panelService');
jest.mock('../services/hookService');
jest.mock('../services/panelSetService');
jest.mock('../requestHandlers/panelSet');
jest.mock('../requestHandlers/image');

import { Sequelize } from 'sequelize';
import { createPanel } from '../services/panelService';
import { _saveImageController } from '../requestHandlers/image';
import { _publishController } from '../requestHandlers/publish';
import { Json } from 'sequelize/types/utils';
import { addSetToHook, createHook } from '../services/hookService';
import { createPanelSet } from '../services/panelSetService';

const sequelizeMock = {
    transaction: jest.fn().mockImplementation(() => ({
        commit:   jest.fn(),
        rollback: jest.fn(),
    })),
} as unknown as jest.Mocked<Sequelize>;

describe('Publish Controller', () => {
    const imageFile = {} as jest.Mocked<Express.Multer.File>;
    const hookPosition = {} as Json;
    const panelReturn = { id: 0, index: 0 };
    const hookReturn = { id: 0, panel_set: 0 };
    const panelSetReturn = { author_id: 'id', id: 0 };
    const imageReturn = { id: 'id' };
    const addSetToHookReturn = { position: [{}], current_panel_set_id: 1, next_panel_set_id: 1 };

    // error happens in panel set creation, throw an error
    test('If author id doesn\'t exist, throw an error', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => { throw new Error('Author Id doesnt exist or some other error making panel set'); });
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 1 }],
            1
        );
        expect(response).toEqual(new Error('Author Id doesnt exist or some other error making panel set'));
    });

    // error in image save 1, 2 or 3 thrown
    test('If saving image fails, throw an error', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelSetReturn));
        (addSetToHook as jest.Mock).mockReturnValue(() => Promise.resolve(addSetToHookReturn));
        (createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelReturn));
        (createHook as jest.Mock).mockReturnValue(() => Promise.resolve(hookReturn));
        (_saveImageController as jest.Mock).mockResolvedValue(new Error('Error saving image'));
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 0 }],
            1
        );
        expect(response).toEqual(new Error('S3 Error: Error saving image'));
    });

    test('If invalid hook id, throw an error', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelSetReturn));
        (addSetToHook as jest.Mock).mockReturnValue(() => Promise.resolve(addSetToHookReturn));
        (createPanel as jest.Mock).mockReturnValue(() => Promise.resolve(panelReturn));
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 1000 }],
            undefined
        );
        expect(response).toBeInstanceOf(Error);
    });

    // if error happens return it
    test('If there is an error in any services, throw an error', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelSetReturn));
        (addSetToHook as jest.Mock).mockReturnValue(() => addSetToHookReturn);
        (createPanel as jest.Mock).mockReturnValue(() => { throw new Error('Error creating panel'); });
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 100 }, { position: hookPosition, panel_index: 1 }],
            1
        );
        expect(response).toEqual(new Error('Error creating panel'));
    });

    // if error happens return it
    test('If failing to add panel set to hook, throw an error', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelSetReturn));
        (addSetToHook as jest.Mock).mockReturnValue(() => Promise.resolve(undefined));
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 100 }, { position: hookPosition, panel_index: 1 }],
            1
        );
        expect(response).toEqual(new Error('Failure to create hook as the hook_id was invalid'));
    });

    // successful return
    test('Successful Publish', async () => {
        (createPanelSet as jest.Mock).mockReturnValue(() => Promise.resolve(panelSetReturn));
        (addSetToHook as jest.Mock).mockReturnValue(() => addSetToHookReturn);
        (createPanel as jest.Mock).mockReturnValue(() => panelReturn);
        (createHook as jest.Mock).mockReturnValue(() => hookReturn);
        (_saveImageController as jest.Mock).mockResolvedValue(imageReturn);
        const response = await _publishController(sequelizeMock)(
            'author_id',
            'new panel set',
            imageFile,
            imageFile,
            imageFile,
            [{ position: hookPosition, panel_index: 0 }, { position: hookPosition, panel_index: 0 }],
            1
        );
        expect(response).toMatchObject({
            panel_set: panelSetReturn.id,
            panels:    [0, 0, 0],
            hooks:     [hookReturn.id, hookReturn.id]
        });
    });
});
