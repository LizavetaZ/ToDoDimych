import {todolistsApi, ToDoListType} from "api/todolists-Api";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {AxiosError} from "axios";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, handleServerNetworkError} from "utils/error-utils";
import {fetchTasks} from "features/TodolistsList/tasks-reducer";
import {ThunkError} from "app/store";

const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        let result = await todolistsApi.getToDoLists();
        result.data.forEach(async (tl: any) => {
            await dispatch(fetchTasks(tl.id))
        })
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: result.data}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (
    todolistId: string
    , thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        thunkAPI.dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        await todolistsApi.deleteToDoList(todolistId);
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (err) {
        return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
    }
})
const addTodolistTC = createAsyncThunk<{todolist: ToDoListType}, string, ThunkError>('todolists/addTodolist', async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.createToDoList(title);
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: result.data.data.item}
        }
        else {
            return handleAsyncServerAppError(result.data, thunkAPI, false)
        }

    } catch (err) {
        return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
    }
})

const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, thunkAPI) => {
    try {
        const result = await todolistsApi.updateToDoList(param.todolistId, param.title)
        if (result.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
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

export const todolistsReducer = slice.reducer
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
