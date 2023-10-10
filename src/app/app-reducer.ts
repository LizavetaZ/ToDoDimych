import {authAPI} from "../api/todolists-Api";
import {setIsLoggedInAC} from "../features/TodolistsList/auth-reducer";
import {ThunkType} from "./store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{error:string | null}>){
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        },
        setAppIsInitializedAC(state, action: PayloadAction<{isInitialized: boolean}>){
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appReducer = slice.reducer
export const {setAppIsInitializedAC, setAppStatusAC, setAppErrorAC} = slice.actions

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.payload.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.payload.error}
//         case "APP/SET-IS-INITIALIZED":
//             return {...state, isInitialized: action.payload.value}
//         default:
//             return state
//     }
// }

// type ActionsType = setAppErrorACType | setAppStatusACType | ReturnType<typeof setAppIsInitializedAC>
//
// export type setAppErrorACType = ReturnType<typeof setAppErrorAC>
// export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
//
// export const setAppErrorAC = (error: null | string) => {
//     return {
//      type: 'APP/SET-ERROR',
//         payload:{
//          error
//         }
//     }as const
// }
//
// export const setAppStatusAC = (status: RequestStatusType) => {
//     return {
//      type: 'APP/SET-STATUS',
//         payload:{
//             status
//         }
//     }as const
// }
//
// export const setAppIsInitializedAC = (value: boolean) => {
//     return {
//         type: 'APP/SET-IS-INITIALIZED',
//         payload:{
//             value
//         }
//     }as const
// }

export const initializeAppTC = ():ThunkType => async (dispatch) => {
    try {
        let result = await authAPI.me()
        if (result.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        }
        else {

        }
        dispatch(setAppIsInitializedAC({isInitialized: true}))
    }
    catch (e) {
        dispatch(setAppIsInitializedAC({isInitialized: false}))
    }
}
