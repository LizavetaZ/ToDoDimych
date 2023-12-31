import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from "api/todolists-Api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "Common/actions/common.action";
import {asyncActions as asyncTodolistsActions} from './todolists-reducer'
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {appActions} from "features/Application";
import {AppRootState, ThunkError} from "utils/types";

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk<{tasks: TaskType[], todolistId: string}, string, ThunkError>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const result = await todolistsApi.getTasks(todolistId)
        thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
        return {tasks: result.data.items, todolistId}
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
export const removeTask = createAsyncThunk<{taskId: string, todolistId: string}, {
    taskId: string,
    todolistId: string
}, ThunkError>('tasks/removeTask', async (param, thunkAPI) => {
    try {
        await todolistsApi.deleteTask(param.todolistId, param.taskId)
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (error: any) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
export const addTask = createAsyncThunk<TaskType, { title: string; todoListId: string }, ThunkError>(
    'tasks/addTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({ status: 'loading' }));

        try {
            const result = await todolistsApi.createTask(param.todoListId, param.title);

            if (result.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setAppStatus({ status: 'succeeded' }));
                return result.data.data.item;
            } else {
                return handleAsyncServerAppError(result.data, thunkAPI, false)
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
}, thunkAPI) => {
    const state = thunkAPI.getState() as AppRootState
    const task = state.tasks[param.todoListId].find(t => t.id == param.taskId)
    if (!task) {
        // throw new Error('Task not found in state')
        return thunkAPI.rejectWithValue('Task not found in state')
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
            return handleAsyncServerAppError(result.data, thunkAPI)
        }
    } catch (err) {
        const error: AxiosError = err as AxiosError
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const asyncActions = {
    updateTask, addTask, removeTask, fetchTasks
}

export const slice = createSlice({
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
