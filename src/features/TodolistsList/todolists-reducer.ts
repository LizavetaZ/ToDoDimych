import {todolistsApi, ToDoListType} from "api/todolists-Api";
import {RequestStatusType} from "features/Application/application-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {AxiosError} from "axios";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {fetchTasks} from "features/TodolistsList/tasks-reducer";
import {appActions} from "features/Application";
import {ThunkError} from "utils/types";

const {setAppStatus} = appActions

const fetchTodolistsTC = createAsyncThunk<{todolists: ToDoListType[]}, undefined, ThunkError>('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        let result = await todolistsApi.getToDoLists();
        result.data.forEach(async (tl: ToDoListType) => {
            await thunkAPI.dispatch(fetchTasks(tl.id))
        })
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {todolists: result.data}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

const removeTodolistTC = createAsyncThunk<{id: string}, string, ThunkError>('todolists/removeTodolist', async (
    todolistId
    , thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        thunkAPI.dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        await todolistsApi.deleteToDoList(todolistId);
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {id: todolistId}
    } catch (err) {
        return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
    }
})

const addTodolistTC = createAsyncThunk<{todolist: ToDoListType}, string, ThunkError>('todolists/addTodolist', async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const result = await todolistsApi.createToDoList(title);
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: result.data.data.item}
        }
        else {
            return handleAsyncServerAppError(result.data, thunkAPI, false)
        }

    } catch (err) {
        return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
    }
})

const changeTodolistTitleTC = createAsyncThunk<{todolistId: string, title: string}, {
    todolistId: string,
    title: string
}, ThunkError>('todolists/changeTodolistTitle', async (param, thunkAPI) => {
    try {
        const result = await todolistsApi.updateToDoList(param.todolistId, param.title)
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId: param.todolistId, title: param.title}
        } else {
            return handleAsyncServerAppError(result.data, thunkAPI)
        }

    } catch (err) {
        return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
    }
})

export const asyncActions = {
    fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC
}

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<ToDoListDomainType>,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(clearTasksAndTodolists, () => {
                return []
            })
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => {
                    return {...tl, filter: 'all', entityStatus: "idle"}
                })
            })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index > -1) {
                    state.splice(index, 1)
                }
            })
            .addCase(addTodolistTC.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
            })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todolistId)
                state[index].title = action.payload.title
            })
    }
})

export const {
    changeTodolistFilter,
    changeTodolistEntityStatus
} = slice.actions


//types
export type FilterValuesType = 'all' | 'completed' | 'active'

export type ToDoListDomainType = ToDoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
