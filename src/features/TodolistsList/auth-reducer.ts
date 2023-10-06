import {setAppStatusAC} from "../../app/app-reducer"
import {authAPI, LoginParamsType} from "../../api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkType} from "../../app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
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
export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }
            else {
                handleServerAppError(result.data, dispatch)
                dispatch(setAppStatusAC({status: 'failed'}))
            }
        })
        .catch ((error) => {
        handleServerNetworkError(error, dispatch)
    }
        )

}

export const logoutTC = ():ThunkType => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }
            else {
                handleServerAppError(result.data, dispatch)
                dispatch(setAppStatusAC({status: 'failed'}))
            }
        })
        .catch ((error) => {
                handleServerNetworkError(error, dispatch)
            }
        )

}


//types

// type ActionTypes = ReturnType<typeof setIsLoggedInAC>
// type InitialStateType = {
//     isLoggedIn: boolean
// }
