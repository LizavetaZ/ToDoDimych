import {setAppStatusAC} from "../../app/app-reducer"
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../Common/actions/common.action";
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

// export const authReducer = (state: InitialStateType = initialState, action: ActionTypes): InitialStateType => {
//     switch (action.type) {
//         case "login/SET-IS-LOGGED-IN":{
//             return {
//                 ...state, isLoggedIn: action.value
//             }
//         }
//         default:
//             return state
//     }
//
// }

//actions
// export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)


//thunks
// export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.login(data)
//         .then(result => {
//             if (result.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             }
//             else {
//                 handleServerAppError(result.data, dispatch)
//                 dispatch(setAppStatusAC({status: 'failed'}))
//             }
//         })
//         .catch ((error) => {
//         handleServerNetworkError(error, dispatch)
//     }
//         )
//
// }

// export const logoutTC = ():ThunkType => async (dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.logout()
//         .then(result => {
//             if (result.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: false}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//                 dispatch(clearTasksAndTodolists())
//             }
//             else {
//                 handleServerAppError(result.data, dispatch)
//                 dispatch(setAppStatusAC({status: 'failed'}))
//             }
//         })
//         .catch ((error) => {
//                 handleServerNetworkError(error, dispatch)
//             }
//         )
//
// }


//types

// type ActionTypes = ReturnType<typeof setIsLoggedInAC>
// type InitialStateType = {
//     isLoggedIn: boolean
// }
