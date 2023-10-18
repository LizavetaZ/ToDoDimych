import {rootReducer, store} from "app/store";
import {ThunkAction} from "redux-thunk";
import {AnyAction} from "redux";
import {FieldErrorType} from "api/todolists-Api";


//redux common types
export type RootReducerType = typeof rootReducer
export type AppRootState = ReturnType<typeof rootReducer>
export type ThunkType = ThunkAction<void,AppRootState,unknown,AnyAction>

export type ThunkError = {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }}