import { Sequelize } from 'sequelize';
import { IHook, IPanel } from '../models';
import { Json } from 'sequelize/types/utils';
import { sequelize } from '../database';

interface HookConfig {
    position: Json,
    current_panel_id: number,
    next_panel_set_id: number|null
}

interface HookCreateInfo {
    id: number,
    position: Json,
    current_panel_id: number,
    next_panel_set_id: number|null
}

interface HookGetInfo {
    position: Json,
    current_panel_id: number,
    next_panel_set_id: number|null
}

/**
 * Create a new hook
 * @param {HookConfig} newHook data to insert into database
 * @returns {HookCreateInfo} Information from the new data entry
 */
const createHook = (sequelize: Sequelize) => async (newHook: HookConfig) => {
    const {
        id, position, current_panel_id, next_panel_set_id
    } = await sequelize.models.hook.create({
        position:          newHook.position,
        current_panel_id:  newHook.current_panel_id,
        next_panel_set_id: newHook.next_panel_set_id
    }) as IHook;
    return {
        id, position, current_panel_id, next_panel_set_id
    } as HookCreateInfo;
};

/**
 * Gets a single hook based on id
 * @param {number} id Hook id
 * @returns {HookGetInfo} with position, current_panel_id, and next_panel_id properties from the hook
 */
const getHook = (sequelize : Sequelize) => async (id: number) => {

    // check that requested hook exists
    const hook = await sequelize.models.hook.findByPk(
        id,
        { attributes: ['position', 'current_panel_id', 'next_panel_set_id'] }
    ) as IHook;
    if (!hook) return undefined;

    // Return the hook's info
    return {
        position:          hook.position,
        current_panel_id:  hook.current_panel_id,
        next_panel_set_id: hook.next_panel_set_id
    } as HookGetInfo;
};

/**
 * Get all hooks that are associated with a specific panel
 * @param {number} panel_id ID of target panel
 * @returns {HookGetInfo[]} Array of all hooks on given panel (empty array if none)
 */
const getPanelHooks = (sequelize: Sequelize) => async (panel_id: number) => {

    // Find all hooks on requested panel 
    const panel = await sequelize.models.panel.findByPk(panel_id, { include: sequelize.models.hook }) as IPanel;
    const hooks = panel.hooks as IHook[];

    // Parse hooks into usable objects
    const parsedHooks = hooks.map((x)=>{
        return {
            position:          x.position,
            current_panel_id:  x.current_panel_id,
            next_panel_set_id: x.next_panel_set_id
        } as HookGetInfo;
    });

    // Return the array of hooks
    return parsedHooks;
};

/**
 * Link the next panel_set to the hook
 * @param {number} hook_id ID of hook to update
 * @param {number} panel_set_id ID of panel set that the hook links to
 * @returns {HookGetInfo} Values from the updated hook
 */
const addSetToHook = (sequelize: Sequelize) => async (hook_id: number, panel_set_id: number) => {

    // get hook and update the next_panel_set_id
    const hook = await sequelize.models.hook.findByPk(hook_id) as IHook;
    if (!hook) return undefined;

    await hook.update({ next_panel_set_id: panel_set_id });

    // Return the altered hook
    return {
        position:          hook.position,
        current_panel_id:  hook.current_panel_id,
        next_panel_set_id: hook.next_panel_set_id
    } as HookGetInfo;
};

const getStatus = (sequelize: Sequelize) => async (id: number) => {
    const hook = await sequelize.models.hook.findByPk(id) as IHook;
    if(!hook) return undefined;

    return {
        linked: hook.next_panel_set_id != null,
        status_message: hook.next_panel_set_id !=null ? `Hook linked to panel_set (id: ${hook.next_panel_set_id})` : 'Hook is empty'
    }
}

export {
    createHook, getHook, getPanelHooks, addSetToHook, getStatus
};
