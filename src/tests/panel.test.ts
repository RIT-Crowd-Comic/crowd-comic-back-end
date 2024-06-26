import {
    _createPanelController, 
    _getPanelController, 
    _getPanelsFromPanelSetIDController
} from '../requestHandlers/panel';

import * as panelService from '../services/panelService';

jest.mock('../services/panelService');

const fakeSequelize = {
    models: {
        panel:
            `{
                id: {
                    type:          DataTypes.INTEGER,
                    primaryKey:    true,
                    autoIncrement: true,
                    allowNull:     false,
                },
                image: {
                    type:      DataTypes.STRING,
                    allowNull: false,
                },
                index: {
                    type:      DataTypes.SMALLINT,
                    allowNull: false,
                },
                panel_set_id: {
                    type:      DataTypes.INTEGER,
                    allowNull: false
                },
            },
            {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            }`
        }
    }
describe('panel queries', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('gePanel', () => {
        panelService.getPanel.mockResolvedValue({
            id: 1,
            image: '.../../blah.png',
            index: 0,
            panel_set_id: 1
        });
        test("If the panel exists, it should be returned", async () => {
            const response = await _getPanelController(fakeSequelize)(1);
            expect(response).toBe({
                id: 1,
                image: '.../../blah.png',
                index: 0,
                panel_set_id: 1
            });
        });
    });
});
