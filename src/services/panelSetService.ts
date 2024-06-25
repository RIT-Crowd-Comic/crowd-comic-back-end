import { Sequelize } from 'sequelize';
import { PanelSet, IPanelSet } from '../models/panelSet.model';
import { sequelize } from '../database';
interface PanelSetConfig {
    author_id: string
}

interface PanelSetInfo {
    id: number;
    author_id: string
}


/**
 * Create a new panel set
 * @param {} panelSet 
*/
const createPanelSet = (sequelize: Sequelize) => async (panelSet: PanelSetConfig): Promise<PanelSetInfo> => {
    const { id, author_id } =
    await sequelize.models.panel_set.create({ author_id: panelSet.author_id, 
    }) as IPanelSet;
    return { author_id, id };
};

/**
 * Gets a panel set based on the id
 * @param {} id the id of the panel set
 * @returns null if the panel set is not found/exists
 */
const getPanelSetByID = (sequelize: Sequelize) => async (id: number) => {
    return await sequelize.models.panel_set.findByPk(id) as IPanelSet;
};

/**
 * Get all of the panels a specific author created
 * @param {} id the author's UUID
 * @returns an array of all the panels found
 */
const getAllPanelSetFromUser = (sequelize: Sequelize) => async (id: string) => {
    return await PanelSet.findAll({ where: { author_id: id } });
};

export { createPanelSet, getPanelSetByID, getAllPanelSetFromUser };
