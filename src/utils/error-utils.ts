import {setAppError, setAppStatus} from "features/Application/application-reducer";
import {ResponseType} from 'api/todolists-Api'
import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {appActions} from "features/Application";
import {DispatchType} from "utils/redux-utils";

// export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError = true) => {
//     if (showError) {
//             dispatch(setAppError({error: data.messages.length ?  data.messages[0]: 'Some error occurred'}))
//     }
//     dispatch(setAppStatus({status: 'failed'}))
// }

export const handleAsyncServerAppError = <D>(data: ResponseType<D>, thunkAPI: ThunkAPISimpleType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({error: data.messages.length ?  data.messages[0]: 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({ errors: data.messages, fieldsErrors: data.fieldsErrors });
}

// export const handleServerNetworkError = (error: AxiosError, dispatch: Dispatch, showError = true) => {
//     if (showError) {
//             dispatch(setAppError({error: error.message ?  error.message : 'Some error occurred'}))
//
//     }
//         dispatch(setAppStatus({status: 'failed'}))
// }

export const handleAsyncServerNetworkError = (error: AxiosError, thunkAPI: ThunkAPISimpleType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({error: error.message ?  error.message : 'Some error occurred'}))

    }
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}


// export const handleAsyncServerNetworkError = (err: unknown, dispatch: DispatchType): void => {
//     let errorMessage = "Some error occurred"
//
//     // ❗Проверка на наличие axios ошибки
//     if (axios.isAxiosError(err)) {
//         // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
//         // ⏺️ err?.message - например при создании таски в offline режиме
//         errorMessage = err.response?.data?.message || err?.message || errorMessage
//         // ❗ Проверка на наличие нативной ошибки
//     } else if (err instanceof Error) {
//         errorMessage = `Native error: ${err.message}`
//         // ❗Какой-то непонятный кейс
//     } else {
//         errorMessage = JSON.stringify(err)
//     }
//     dispatch(appActions.setAppError({ error: errorMessage }))
//     dispatch(appActions.setAppStatus({ status: "failed" }))
// }


type ThunkAPISimpleType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}