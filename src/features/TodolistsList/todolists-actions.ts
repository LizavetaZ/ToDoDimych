import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {todolistsApi} from "api/todolists-Api";
import {AxiosError} from "axios/index";
import {handleServerNetworkError} from "utils/error-utils";
import {fetchTasksTC} from "features/TodolistsList/task-actions";
import {changeTodolistEntityStatusAC} from "features/TodolistsList/todolists-reducer";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let result = await todolistsApi.getToDoLists();
        result.data.forEach(async (tl: any) => {
            await dispatch(fetchTasksTC(tl.id))
        })
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: result.data}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (param: {
    todolistId: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'loading'}))
        await todolistsApi.deleteToDoList(param.todolistId);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: param.todolistId}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (param: { title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.createToDoList(param.title);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: result.data.data.item}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    try {
        await todolistsApi.updateToDoList(param.todolistId, param.title)
        return {todolistId: param.todolistId, title: param.title}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})