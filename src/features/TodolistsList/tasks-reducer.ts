import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from "../../api/todolists-Api";
import {AppRootState, ThunkType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../Common/actions/common.action";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string,thunkAPI) => {
    try {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
       const result = await todolistsApi.getTasks(todolistId)
        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return  {tasks: result.data.items, todolistId}
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {taskId: string, todolistId: string}, thunkAPI) => {
    try {
        await todolistsApi.deleteTask(param.todolistId, param.taskId)
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (error: any) {
        handleServerNetworkError(error, thunkAPI.dispatch)
    }
})

export const addTaskTC = (title: string, todoListId: string): ThunkType => async (dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const result = await todolistsApi.createTask(todoListId, title)
        if (result.data.resultCode === 0) {
            dispatch(addTaskAC(result.data.data.item))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(result.data, dispatch)
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}


export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string): ThunkType => async (dispatch, getState: () => AppRootState) => {
    try {
        const state = getState()
        const task = state.tasks[todoListId].find(t => t.id == taskId)
        if (!task) {
            // throw new Error('Task not found in state')
            console.warn('Task not found in state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            completed: task.completed,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        const res = await todolistsApi.updateTask(todoListId, taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(updateTaskAC({taskId, domainModel, todoListId}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}

// export const fetchTasksTC_ = (todolistId: string): ThunkType => async (dispatch) => {
//     try {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         const result = await todolistsApi.getTasks(todolistId)
//         dispatch(setAppStatusAC({status: 'succeeded'}))
//         dispatch(setTasksAC({tasks: result.data.items, todolistId}))
//     } catch (error: any) {
//         handleServerNetworkError(error, dispatch)
//     }
// }

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<TaskType>) {
            state[action.payload.todoListId].unshift(action.payload)
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach((tl: any) => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
            .addCase(fetchTasksTC.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolistId] = action.payload.tasks;
                }
            })
            .addCase(removeTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                    if (index > -1) {
                        tasks.splice(index, 1)
                    }
                }
            })
    }
})

export const tasksReducer = slice.reducer
export const {addTaskAC, updateTaskAC
} = slice.actions

// export const tasksReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//          return {...state, [action.todoListId]: state[action.todoListId].filter(tl=> tl.id !== action.taskId)}
//         case 'ADD-TASK':
//             return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
//         }
//         case 'UPDATE-TASK':
//             return {...state,[action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
//                 ...t, ...action.domainModel
//             } : t)}
//         case addTodolistAC.type:
//             return {...state, [action.payload.todolist.id]:[]}
//         case removeTodolistAC.type: {
//             const stateCopy = {...state}
//             delete stateCopy[action.payload.id]
//             return stateCopy
//         }
//         case setTodolistsAC.type: {
//             const copyState = {...state}
//             action.payload.todolists.forEach((tl:any) => {
//                 copyState[tl.id] = []
//             })
//             return copyState
//         }
//         case "SET-TASKS":
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state
//     }
//
// }

//actions
// export const removeTaskAC = (taskId: string, todoListId: string) => ({type: 'REMOVE-TASK', todoListId, taskId} as const)
//
// export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
//
// export const updateTaskAC = (taskId: string, domainModel:UpdateDomainTaskModelType, todoListId: string) => ({type: 'UPDATE-TASK', taskId, domainModel, todoListId} as const)
//
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)

//thunks

// export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => async (dispatch) => {
//     try {
//         await todolistsApi.deleteTask(todolistId, taskId)
//         dispatch(removeTaskAC({taskId, todolistId}))
//     } catch (error: any) {
//         handleServerNetworkError(error, dispatch)
//     }
// }
//
// export const addTaskTC = (title: string, todoListId: string): ThunkType => async (dispatch) => {
//     try {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         const result = await todolistsApi.createTask(todoListId, title)
//         if (result.data.resultCode === 0) {
//             dispatch(addTaskAC(result.data.data.item))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         } else {
//             handleServerAppError(result.data, dispatch)
//         }
//     } catch (error: any) {
//         handleServerNetworkError(error, dispatch)
//     }
// }
//
//
// export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todoListId: string): ThunkType => async (dispatch, getState: () => AppRootState) => {
//     try {
//         const state = getState()
//         const task = state.tasks[todoListId].find(t => t.id == taskId)
//         if (!task) {
//             // throw new Error('Task not found in state')
//             console.warn('Task not found in state')
//             return
//         }
//         const apiModel: UpdateTaskModelType = {
//             title: task.title,
//             description: task.description,
//             completed: task.completed,
//             status: task.status,
//             priority: task.priority,
//             startDate: task.startDate,
//             deadline: task.deadline,
//             ...domainModel
//         }
//         const res = await todolistsApi.updateTask(todoListId, taskId, apiModel)
//         if (res.data.resultCode === 0) {
//             dispatch(updateTaskAC({taskId, domainModel, todoListId}))
//         } else {
//             handleServerAppError(res.data, dispatch)
//         }
//     } catch (error: any) {
//         handleServerNetworkError(error, dispatch)
//     }
// }

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
