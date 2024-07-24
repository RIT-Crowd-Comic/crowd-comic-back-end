import { Sequelize, Transaction } from 'sequelize';
import { IPanelSet, IUser } from '../models';
interface PanelSetConfig {
    author_id: string,
    name: string | null
}

interface PanelSetInfo {
    id: number;
    author_id: string,
    name: string | null
}


/**
 * Create a new panel set
 * @param {} panelSet 
*/
const createPanelSet = (sequelize: Sequelize, transaction? : Transaction) => async (panelSet: PanelSetConfig): Promise<PanelSetInfo> => {
    const { id, author_id, name } =
    await sequelize.models.panel_set.create({ author_id: panelSet.author_id, name: panelSet.name }, transaction ? { transaction } : {}) as IPanelSet;
    return { author_id, id, name };
};

/**
 * Gets a panel set based on the id
 * @param {} id the id of the panel set
 * @returns null if the panel set is not found/exists
 */
const getPanelSetByID = (sequelize: Sequelize) => async (id: number) => {
    return await sequelize.models.panel_set.findByPk(id, { include: [sequelize.models.panel, sequelize.models.hook] }) as IPanelSet;
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

/**
 * Find and return an array of a "trunk" panel_sets in db
 * @returns {IPanelSet[]}
 */
const getAllTrunkSets = async (sequelize: Sequelize) => {
    const allSets = await sequelize.models.panel_set.findAll({ include: sequelize.models.hook }) as IPanelSet[];
    const trunks = [] as IPanelSet[];
    allSets.forEach(set => {
        if (!set.hook) trunks.push(set);
    });

    return trunks as IPanelSet[];
};
const getTree = (sequelize: Sequelize) => async (panel_set: IPanelSet) => {
    const [results]  = await sequelize.query(`WITH RECURSIVE panel_set_tree AS (
        -- Base case: start with the given panel_set_id
        SELECT 
            ps.id AS panel_set_id,
            ps.author_id,
            ps.created_at,
            ps.updated_at,
            0 AS level,
            CAST(ps.id AS TEXT) AS path,
            NULL::INTEGER AS parent_panel_set_id
        FROM 
            panel_sets ps
        WHERE 
            ps.id = ${panel_set.id}
    
        UNION ALL
    
        -- Recursive case: find direct child panel_sets
        SELECT 
            next_ps.id AS panel_set_id,
            next_ps.author_id,
            next_ps.created_at,
            next_ps.updated_at,
            pst.level + 1 AS level,
            pst.path || '->' || CAST(next_ps.id AS TEXT) AS path,
            pst.panel_set_id AS parent_panel_set_id
        FROM 
            panel_set_tree pst
        JOIN 
            panels p ON p.panel_set_id = pst.panel_set_id
        JOIN 
            hooks h ON h.current_panel_id = p.id
        JOIN 
            panel_sets next_ps ON next_ps.id = h.Next_panel_set_id
        WHERE 
            h.Next_panel_set_id IS NOT NULL
    )
    SELECT 
        panel_set_id,
        parent_panel_set_id,
        author_id,
        created_at,
        updated_at,
        level,
        path
    FROM 
        panel_set_tree
    ORDER BY 
        path;`);

    return results;

};

export {
    getTree, createPanelSet, getPanelSetByID, getAllPanelSetsFromUser, getAllTrunkSets
};
