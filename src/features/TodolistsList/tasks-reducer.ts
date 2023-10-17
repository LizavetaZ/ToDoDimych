import {
    FieldErrorType,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsApi,
    UpdateTaskModelType
} from "api/todolists-Api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {asyncActions as asyncTodolistsActions} from './todolists-reducer'
import {handleAsyncServerNetworkError, handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {setAppStatusAC} from "app/app-reducer";
import {AppRootState, ThunkError} from "app/store";

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const result = await todolistsApi.getTasks(todolistId)
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {tasks: result.data.items, todolistId}
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})
export const removeTask = createAsyncThunk('tasks/removeTask', async (param: {
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
export const addTask = createAsyncThunk<TaskType, { title: string; todoListId: string }, ThunkError>(
    'tasks/addTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));

        try {
            const result = await todolistsApi.createTask(param.todoListId, param.title);

            if (result.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
                return result.data.data.item;
            } else {
                handleServerAppError(result.data, thunkAPI.dispatch, false);
                return thunkAPI.rejectWithValue({ errors: result.data.messages, fieldsErrors: result.data.fieldsErrors });
            }
        } catch (err) {
          return handleAsyncServerNetworkError(err as AxiosError, thunkAPI, false);
        }
    }
);
export const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
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

export const asyncActions = {
    updateTask, addTask, removeTask, fetchTasks
}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
            .addCase(asyncTodolistsActions.removeTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolistId] = action.payload.tasks;
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                    if (index > -1) {
                        tasks.splice(index, 1)
                    }
                }
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todoListId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })
    }
})

export const tasksReducer = slice.reducer

//types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
