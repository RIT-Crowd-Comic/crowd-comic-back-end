import { Sequelize } from "sequelize";
import { PanelSet } from "../models/panelSet.model";
import { User } from "../models/user.model";

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
const createPanelSet = async (panelSet: PanelSetConfig): Promise<PanelSetInfo> => {
    const {id, author_id } = await PanelSet.create({
        author_id: panelSet.author_id,
    });

    return {author_id, id}
}

/**
 * Gets a panel set based on the id
 * @param {} id the id of the panel set
 * @returns null if the panel set is not found/exists
 */
const getPanelSetByID = async (id: number) => {
    return await PanelSet.findByPk(id);
}

/**
 * Get all of the panels a specific author created
 * @param {} id the author's UUID
 * @returns an array of all the panels found
 */
const getAllPanelSetFromUser = async (id: string) => {
    const panelSets = await PanelSet.findAll({
        where: {author_id: id}
    });
    return panelSets;
    }

    export {
        createPanelSet, getPanelSetByID, getAllPanelSetFromUser
    };