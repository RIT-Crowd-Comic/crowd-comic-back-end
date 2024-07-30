import {
    _saveImageController,
    _getImageControllerSigned,
    _getAllImageUrlsByPanelSetIdController
} from '../requestHandlers/image';
import * as imageService from '../services/imageService';
jest.mock('../services/imageService');

// todo: make tests for _getAllImagesByPanelSetIdController

describe('Save Image Controller', () => {
    const buffer: Buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);
    test('If an error is thrown, that error should be returned', async () => {
        (imageService.saveImage as jest.Mock).mockResolvedValue(new Error('Error saving image'));
        const response = await _saveImageController('asdfafasdf', buffer, 'image/png');
        expect(response).toBeInstanceOf(Error);
    });
    test('If input is valid, a object with an id should be returned', async () => {
        (imageService.saveImage as jest.Mock).mockResolvedValue({ id: 'asdasfddaer3fdsdf' });
        const response = await _saveImageController('asdfafasdf', buffer, 'image/png');
        expect(response).toEqual({ id: 'asdasfddaer3fdsdf' });
    });
});

describe('Get Image Controller Signed', () => {
    test('if an error is thrown, that error should be returned', async () => {
        (imageService.getImageSigned as jest.Mock).mockResolvedValue(new Error('Error getting image'));
        const response = await _getImageControllerSigned('fakeid');
        expect(response).toBeInstanceOf(Error);
    });
    test('if input is valid, a object with an id should be returned', async () => {
        (imageService.getImageSigned as jest.Mock).mockResolvedValue({ url: 'abcd.link' });
        const response = await _getImageControllerSigned('fakeid');
        expect(response).toEqual({ url: 'abcd.link' });
    });
});

describe('Get All Image URLs By Panel Set ID Controller', () => {
    test('If an error is thrown, that error should be returned', async () => {
        (imageService.getAllImagesByPanelSetId as jest.Mock).mockReturnValue(() => Promise.resolve(null));
        const response = await _getAllImageUrlsByPanelSetIdController(0);
        expect(response).toEqual(new Error(`Invalid panel id: ${0}`));
    });
    test('Return a list of panel images', async () => {
        const panelImages = [{ image: 'image1' }, { image: 'image2' }, { image: 'image3' }];

        (imageService.getAllImagesByPanelSetId as jest.Mock).mockReturnValue(() => Promise.resolve(panelImages));

        const response = await _getAllImageUrlsByPanelSetIdController(0);
        expect(response).toEqual(panelImages.map(p => ({ url: p.image })));
    });
});
