import {AppRootState} from "utils/types";

export const selectStatus = (state: AppRootState) => state.app.status
export const selectIsInitialized = (state: AppRootState) => state.app.isInitialized