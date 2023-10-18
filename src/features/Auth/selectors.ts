import {AppRootState} from "utils/types";


export const selectIsLoggedIn = (state: AppRootState) => state.auth.isLoggedIn