import { IUser, define as userDefine } from './user.model';
import { IHook, define as hookDefine } from './hook.model';
import { IPanel, define as panelDefine } from './panel.model';
import { IPanelSet, define as panelSetDefine } from './panelSet.model';
import { ISession, define as sessionDefine } from './session.model';
const modelDefiners = [
    userDefine,
    hookDefine,
    panelDefine,
    panelSetDefine,
    sessionDefine
];

export {
    modelDefiners, type IUser, type IHook, type IPanel, type IPanelSet, type ISession
};
