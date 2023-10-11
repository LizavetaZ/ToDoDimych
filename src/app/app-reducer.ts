import {authAPI} from "../api/todolists-Api";
import {setIsLoggedInAC} from "../features/TodolistsList/auth-reducer";
import {ThunkType} from "./store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../Common/actions/common.action";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {AxiosError} from "axios/index";

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean
}


export const initializeAppTC =  createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    try {
        let result = await authAPI.me()
        if (result.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        }
        else {

        }
    }
    catch (e) {
        // dispatch(setAppIsInitializedAC({isInitialized: false}))
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{error:string | null}>){
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        }
    },
    extraReducers:(builder) =>{
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

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

// export const initializeAppTC = ():ThunkType => async (dispatch) => {
//     try {
//         let result = await authAPI.me()
//         if (result.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({value: true}))
//         }
//         else {
//
//         }
//         dispatch(setAppIsInitializedAC({isInitialized: true}))
//     }
//     catch (e) {
//         dispatch(setAppIsInitializedAC({isInitialized: false}))
//     }
// }
