import {Dispatch} from "redux"
import {setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer"
import {authAPI, LoginParamsType} from "../../api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";



const initialState: InitialStateType = {}

export const loginReducer = (state: InitialStateType = initialState, action: ActionTypes): InitialStateType => {
    switch (action.type) {
        default:
            return state
    }

}

//actions
// export const removeTaskAC = (taskId: string, todoListId: string) => ({type: 'REMOVE-TASK', todoListId, taskId} as const)


//thunks
export const loginTC = (data: LoginParamsType):any => async (dispatch: Dispatch<ActionTypes | setAppErrorACType | setAppStatusACType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(result => {
            if (result.data.resultCode === 0) {

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

type ActionTypes = any
type InitialStateType = {}

type ThunkDispatch = Dispatch<ActionTypes | setAppStatusACType | setAppErrorACType>