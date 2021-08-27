import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"
import { actions } from "../store";
import { BotSettings } from "../models/BotSettings";
import { RootState } from "../store/reducers"

export const useBotStatus = () => {
    const botStatusState = useSelector((state: RootState) => state.botStatus);
    const dispatch = useDispatch();
    const botSettings = botStatusState.botSettingsUpdates;
    const errors = {
        load: botStatusState.loadError,
        save: botStatusState.saveError,
    };

    const addUpdate = useCallback(
        (settings: Omit<Partial<BotSettings>, 'id'>) => dispatch(actions.updateBotSettings(settings)),
        [dispatch]
    );

    const saveSettings = useCallback(() => dispatch(actions.saveBotSettings()), [dispatch]);
    const loadSettings = useCallback(() => dispatch(actions.loadBotSettings()), [dispatch]);
    return {
        botSettings,
        errors,
        addUpdate,
        saveSettings,
        loadSettings,
    };
}