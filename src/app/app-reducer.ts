import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-Api";
import {setIsLoggedInAC} from "../features/TodolistsList/auth-reducer";

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean
}

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.payload.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.payload.value}
        default:
            return state
    }
}

type ActionsType = setAppErrorACType | setAppStatusACType | ReturnType<typeof setAppIsInitializedAC>

export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
export type setAppStatusACType = ReturnType<typeof setAppStatusAC>

export const setAppErrorAC = (error: null | string) => {
    return {
     type: 'APP/SET-ERROR',
        payload:{
         error
        }
    }as const
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
     type: 'APP/SET-STATUS',
        payload:{
            status
        }
    }as const
}

export const setAppIsInitializedAC = (value: boolean) => {
    return {
        type: 'APP/SET-IS-INITIALIZED',
        payload:{
            value
        }
    }as const
}

export const initializeAppTC = ():any => async (dispatch: Dispatch) => {
    try {
        let result = await authAPI.me()
        if (result.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true))
        }
        else {

        }
        dispatch(setAppIsInitializedAC(true))
    }
    catch (e) {
        dispatch(setAppIsInitializedAC(false))
    }
}