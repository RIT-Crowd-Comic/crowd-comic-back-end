import { Sequelize } from 'sequelize';
import { IPanel } from '../models';

interface PanelConfig {
    image: string,
    index: number,
    panel_set_id: number,
}

/**
 * Create a new Panel
 * @param {} newPanel
 * @returns {} PanelInfoCreate
 */
const createPanel = (sequelize : Sequelize) => async(newPanel: PanelConfig) => {
    const {
        id, image, index, panel_set_id
    } = await sequelize.models.panel.create({
        image:        newPanel.image,
        index:        newPanel.index,
        panel_set_id: newPanel.panel_set_id,
    }) as IPanel;

    return {
        id, image, index, panel_set_id
    } as {
        id: number,
        image: string,
        index: number,
        panel_set_id: number
    };
};

// update panel currently cannot be called independantly of other services
const updatePanel = async(oldPanel: IPanel, newPanel : PanelConfig) => {
    const {
        id, image, index, panel_set_id
    } =
    await oldPanel.update({
        image:        newPanel.image,
        index:        newPanel.index,
        panel_set_id: newPanel.panel_set_id,
    }) as IPanel;

    return {
        id, image, index, panel_set_id
    } as {
        id: number,
        image: string,
        index: number,
        panel_set_id: number
    };
};

/**
 * Get a panel before 
 * @param id 
 * @returns PanelInfoGet
 */
const getPanel = (sequelize : Sequelize) => async(id: number) => {

    // make sure the panel actually exists
    const panel = await sequelize.models.panel.findOne({
        where:      { id },
        attributes: ['image', 'index', 'panel_set_id']
    }) as IPanel;

    if (!panel) return undefined;

    return {
        image:        panel.image,
        index:        panel.index,
        panel_set_id: panel.panel_set_id as number
    };
};

const getPanelBasedOnPanelSetAndIndex = (sequelize : Sequelize) => async (index : number, panel_set_id : number) => {

    // make sure the panel actually exists
    const panel = await sequelize.models.panel.findOne({
        where:      { panel_set_id, index },
        attributes: ['id', 'image']
    }) as IPanel;

    if (!panel) return undefined;

    return panel;
};

/**
 * Get all panels that are associated with a specific panelSet
 * @param {number} panel_set_id ID of panelSet
 * @returns {object[]} An array of objects with id, image, index properties
 */
const getPanelsFromPanelSetID = (sequelize : Sequelize) => async (panel_set_id: number) => {

    // Find all panels on requested panelSet 
    const panels = await sequelize.models.panel.findAll({ where: { panel_set_id } }) as IPanel[];

    // Map panels to keep only needed data
    return panels.map((p) => ({
        id:    p.id as number,
        image: p.image,
        index: p.index
    }));
};


export {
    getPanelsFromPanelSetID, createPanel, getPanel, getPanelBasedOnPanelSetAndIndex, updatePanel
};
