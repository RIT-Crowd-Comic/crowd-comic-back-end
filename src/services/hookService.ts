import { Sequelize } from 'sequelize';
import { IHook } from '../models';

interface HookConfig {
    position: number[],
    current_panel_id: number,
    next_panel_set_id: number|null
}

interface HookCreateInfo {
    id: number,
    position: number[],
    current_panel_id: number,
    next_panel_set_id: number|null
}

interface HookGetInfo {
    position: number[],
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
    const hook = await sequelize.models.hook.findOne({
        where:      { id },
        attributes: ['position', 'current_panel_id', 'next_panel_set_id']
    }) as IHook;
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
    const hooks = await sequelize.models.hook.findAll({ where: { current_panel_id: panel_id } }) as IHook[];

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
    const hook = await sequelize.models.hook.findOne({ where: { id: hook_id } }) as IHook;
    if (!hook) return undefined;

    hook.next_panel_set_id = panel_set_id;
    hook.save();

    // Return the altered hook
    return {
        position:          hook.position,
        current_panel_id:  hook.current_panel_id,
        next_panel_set_id: hook.next_panel_set_id
    } as HookGetInfo;
};

export {
    createHook, getHook, getPanelHooks, addSetToHook
};
