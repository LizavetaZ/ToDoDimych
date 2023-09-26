import {AddTodolistActionType, RemoveTodoListActionType, SetTodolistsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi, UpdateTaskModelType} from "../../api/todolists-Api";
import {Dispatch} from "redux";
import {AppRootState} from "../../app/store";
import {setAppErrorAC, setAppErrorACType, setAppStatusAC, setAppStatusACType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionTypes): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
         return {...state, [action.todoListId]: state[action.todoListId].filter(tl=> tl.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
        }
        case 'UPDATE-TASK':
            return {...state,[action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                ...t, ...action.domainModel
            } : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]:[]}
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }

}

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => ({type: 'REMOVE-TASK', todoListId, taskId} as const)

export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)

export const updateTaskAC = (taskId: string, domainModel:UpdateDomainTaskModelType, todoListId: string) => ({type: 'UPDATE-TASK', taskId, domainModel, todoListId} as const)

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)

//thunks
export const fetchTasksTC = (todolistId: string): any => async (dispatch: Dispatch<ActionTypes | setAppStatusACType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistsApi.getTasks(todolistId)
        dispatch(setTasksAC(result.data.items, todolistId))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}

export const removeTaskTC = (taskId: string, todolistId: string): any => async (dispatch: Dispatch<ActionTypes>) => {
    try {
        await todolistsApi.deleteTask(todolistId, taskId)
        dispatch(removeTaskAC(taskId, todolistId))
    }
    catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}

export const addTaskTC = (title: string, todoListId: string): any => async (dispatch: Dispatch<ActionTypes | setAppErrorACType | setAppStatusACType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        const result = await todolistsApi.createTask(todoListId, title)
        if (result.data.resultCode === 0) {
            dispatch(addTaskAC(result.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        }
        else {
            handleServerAppError(result.data, dispatch)
        }
    }
    catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}



export const updateTaskTC = (taskId: string, domainModel:UpdateDomainTaskModelType, todoListId: string): any => async (dispatch: ThunkDispatch, getState:()=> AppRootState) => {
    try {
        const state = getState()
        const task = state.tasks[todoListId].find(t=> t.id == taskId)
        if (! task) {
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
        if(res.data.resultCode === 0) {
            dispatch(updateTaskAC(taskId, domainModel, todoListId))
        }
        else {
            handleServerAppError(res.data, dispatch)
        }
    }
    catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
}

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

type ActionTypes =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodoListActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


type ThunkDispatch = Dispatch<ActionTypes | setAppStatusACType | setAppErrorACType>