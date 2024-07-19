import { _getImageController, _saveImageController } from '../requestHandlers/image';
import * as imageService from '../services/imageService';
jest.mock('../services/imageService');

// todo: make tests for _getAllImagesByPanelSetIdController

describe('Save Image', () => {
    const buffer: Buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);
    test('if an error is thrown, that error should be returned', async () =>{
        (imageService.saveImage as jest.Mock).mockResolvedValue(new Error('Error saving image'));
        const response = await _saveImageController('asdfafasdf', buffer, 'image/png');
        expect(response).toBeInstanceOf(Error);
    });
    test('if input is valid, a object with an id should be returned', async () =>{
        (imageService.saveImage as jest.Mock).mockReturnValue({ id: 'asdasfddaer3fdsdf' });
        const response = await _saveImageController('asdfafasdf', buffer, 'image/png');
        expect(response).toEqual({ id: 'asdasfddaer3fdsdf' });
    });
});

describe('Get Image', () => {
    test('if an error is thrown, that error should be returned', async () =>{
        (imageService.getImage as jest.Mock).mockResolvedValue(new Error('Error getting image'));
        const response = await _getImageController('fakeid');
        expect(response).toBeInstanceOf(Error);
    });
    test('if input is valid, a object with an id should be returned', async () =>{
        (imageService.getImage as jest.Mock).mockReturnValue({ url: 'abcd.link' });
        const response = await _getImageController('fakeid');
        expect(response).toEqual({ url: 'abcd.link' });
    });
});

