import {setAppStatusAC} from "app/app-reducer"
import {authAPI, FieldErrorType, LoginParamsType} from "api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk<boolean, LoginParamsType, {
    rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let result = await authAPI.login(param)
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return true
        } else {
            handleServerAppError(result.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
            return thunkAPI.rejectWithValue({errors: result.data.messages, fieldsErrors: result.data.fieldsErrors})
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
});

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let result = await authAPI.logout()
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: false}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            thunkAPI.dispatch(clearTasksAndTodolists())
            return
        } else {
            handleServerAppError(result.data, thunkAPI.dispatch)
            thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
            return thunkAPI.rejectWithValue({})
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = true
            }
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
                state.isLoggedIn = false
        })
    }

})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
