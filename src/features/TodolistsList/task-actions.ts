import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatusAC} from "app/app-reducer";
import {todolistsApi, UpdateTaskModelType} from "api/todolists-Api";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {AppRootState} from "app/store";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.getTasks(todolistId)
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks: result.data.items, todolistId}
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {
    taskId: string,
    todolistId: string
}, thunkAPI) => {
    try {
        await todolistsApi.deleteTask(param.todolistId, param.taskId)
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: {
    title: string,
    todoListId: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.createTask(param.todoListId, param.title)
        if (result.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return result.data.data.item
        } else {
            handleServerAppError(result.data, dispatch)
            dispatch(setAppStatusAC({status: 'failed'}))
            return rejectWithValue(null)
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todoListId: string
}, {dispatch, rejectWithValue, getState}) => {
    const state = getState() as AppRootState
    const task = state.tasks[param.todoListId].find(t => t.id == param.taskId)
    if (!task) {
        // throw new Error('Task not found in state')
        return rejectWithValue('Task not found in state')
    }
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        completed: task.completed,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel
    }
    const result = await todolistsApi.updateTask(param.todoListId, param.taskId, apiModel)
    try {
        if (result.data.resultCode === 0) {
            return param
        } else {
            handleServerAppError(result.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})