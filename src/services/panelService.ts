import { Sequelize, Op } from 'sequelize';
import { IPanel, IPanelSet } from '../models';
import { sequelize } from '../database';

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
 * @param {number[]} ids the ids of the panel set(s)
 * @returns {object[]} An array of objects with id, image, index properties
 */
const getPanelsFromPanelSetIDs = (sequelize : Sequelize) => async (ids: number[]) => {

    //get all of the panel_sets with the given ids
    const panel_sets = await sequelize.models.panel_set.findAll({
            include: sequelize.models.panel,
            where: {[Op.or]: ids.map(id => {return {id: id}})}
      }) as IPanelSet[];
      let panels = [] as IPanel[];
      for(const panel_set of panel_sets) {
        if(panel_set.panels?.length !== undefined && panel_set.panels.length > 0) {
            panels = panels.concat(panel_set.panels);
        }
      }

      return panels;
};


export {
    getPanelsFromPanelSetIDs, createPanel, getPanel, getPanelBasedOnPanelSetAndIndex, updatePanel
};
