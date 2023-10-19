import {setAppStatus} from "features/Application/application-reducer"
import {authAPI, FieldErrorType, LoginParamsType} from "api/todolists-Api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {AxiosError} from "axios";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";


export const login = createAsyncThunk<boolean, LoginParamsType, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        let result = await authAPI.login(param)
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return true
        } else {
            return handleAsyncServerAppError(result.data, thunkAPI)
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
       return handleAsyncServerNetworkError(error, thunkAPI)
    }
});

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        let result = await authAPI.logout()
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedIn({value: false}))
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            thunkAPI.dispatch(clearTasksAndTodolists())
            return
        } else {
            return  handleAsyncServerAppError(result.data, thunkAPI)
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const asyncActions = {
    logout, login
}


export const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = true
            }
        })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false
        })
    }

})

export const authReducer = slice.reducer
export const setIsLoggedIn = slice.actions.setIsLoggedInAC
