import { Sequelize, Transaction } from 'sequelize';
import { IPanelSet, IUser } from '../models';
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
const createPanelSet = (sequelize: Sequelize, transaction? : Transaction) => async (panelSet: PanelSetConfig): Promise<PanelSetInfo> => {
    const { id, author_id } =
    await sequelize.models.panel_set.create({ author_id: panelSet.author_id }, transaction ? { transaction } : {}) as IPanelSet;
    return { author_id, id };
};

/**
 * Gets a panel set based on the id
 * @param {} id the id of the panel set
 * @returns null if the panel set is not found/exists
 */
const getPanelSetByID = (sequelize: Sequelize) => async (id: number) => {
    return await sequelize.models.panel_set.findByPk(id, { include: sequelize.models.panel }) as IPanelSet;
};

/**
 * Get all of the panels a specific author created
 * @param {} id the author's UUID
 * @returns an array of all the panels found
 */
const getAllPanelSetsFromUser = (sequelize: Sequelize) => async (id: string) => {
    const user = await sequelize.models.user.findByPk(id, { include: sequelize.models.panel_set }) as IUser;
    if (!user) return [];
    return user.panel_sets as IPanelSet[];
};

export { createPanelSet, getPanelSetByID, getAllPanelSetsFromUser };
