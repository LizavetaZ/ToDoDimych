import {authAPI} from "api/todolists-Api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/Auth";

export type InitialStateType = {
    status: RequestStatusType,
    error: string | null,
    isInitialized: boolean
}


const initializeApp =  createAsyncThunk('application/initializeApp', async (param, {dispatch}) => {
    try {
        let result = await authAPI.me()
        if (result.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedInAC({value: true}))
        }
        else {
        }
    }
    catch (e) {
        // dispatch(setAppIsInitializedAC({isInitialized: false}))
    }
})

export const asyncActions = {
    initializeApp
}

export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppError(state, action: PayloadAction<{error:string | null}>){
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status
        }
    },
    extraReducers:(builder) =>{
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const {setAppStatus, setAppError} = slice.actions

