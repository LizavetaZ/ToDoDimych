import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from '../api/todolists-Api'
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    }
    else {
        dispatch(setAppErrorAC({error:'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: {message: string }, dispatch: Dispatch) => {
    if (error instanceof Error) {
        dispatch(setAppErrorAC({error: error.message}))
        dispatch(setAppStatusAC({status: 'failed'}))
    }
    else {
        dispatch(setAppErrorAC({error:'An unknown error occurred'}))
        dispatch(setAppStatusAC({status: 'failed'}))
    }
}