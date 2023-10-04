import {Dispatch} from "redux"
import {setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer"
import {authAPI, LoginParamsType} from "../../api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


const initialState: InitialStateType = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionTypes): InitialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":{
            return {
                ...state, isLoggedIn: action.value
            }
        }
        default:
            return state
    }

}

//actions
export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)


//thunks
export const loginTC = (data: LoginParamsType):any => async (dispatch: Dispatch<ActionTypes | setAppErrorACType | setAppStatusACType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            }
            else {
                handleServerAppError(result.data, dispatch)
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch ((error) => {
        handleServerNetworkError(error, dispatch)
    }
        )

}

export const logoutTC = ():any => async (dispatch: Dispatch<ActionTypes | setAppErrorACType | setAppStatusACType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(result => {
            if (result.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            }
            else {
                handleServerAppError(result.data, dispatch)
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch ((error) => {
                handleServerNetworkError(error, dispatch)
            }
        )

}


//types

type ActionTypes = ReturnType<typeof setIsLoggedInAC>
type InitialStateType = {
    isLoggedIn: boolean
}
