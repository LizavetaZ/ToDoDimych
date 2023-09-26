import {setAppErrorAC, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../app/app-reducer";
import {ResponseType} from '../api/todolists-Api'
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<setAppErrorACType | setAppStatusACType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    }
    else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: {message: string }, dispatch: Dispatch<setAppErrorACType | setAppStatusACType>) => {
    if (error instanceof Error) {
        dispatch(setAppErrorAC(error.message))
        dispatch(setAppStatusAC('failed'))
    }
    else {
        dispatch(setAppErrorAC('An unknown error occurred'))
        dispatch(setAppStatusAC('failed'))
    }
}