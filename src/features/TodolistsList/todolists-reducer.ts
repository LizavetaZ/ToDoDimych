import {todolistsApi, ToDoListType} from "api/todolists-Api";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "utils/error-utils";
import {fetchTasks} from "features/TodolistsList/tasks-reducer";

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
    , {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
        await todolistsApi.deleteToDoList(todolistId);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {id: todolistId}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
const addTodolistTC = createAsyncThunk('todolists/addTodolist', async ( title: string , {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.createToDoList(title);
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolist: result.data.data.item}
    } catch (err) {
        const error: AxiosError = err as AxiosError
        handleServerNetworkError(error, dispatch)
        return rejectWithValue(null)
    }
})
const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
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
