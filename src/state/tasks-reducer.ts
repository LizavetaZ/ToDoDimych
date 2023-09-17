import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {
    AddTotodlistActionType,
    RemoveTodoListActionType,
    setTodolistsAC,
    SetTodolistsActionType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsApi} from "../api/todolists-Api";
import {Dispatch} from "redux";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todoListId: string,
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    taskId: string,
    status: TaskStatuses,
    todoListId: string
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    taskId: string,
    title: string
    todoListId: string
}

export type AddTodolistForTasksActionType = {
    type: 'ADD-TODOLIST',
    todolistId: string
}

export type SetTasksActionType = {
    type: 'SET-TASKS',
    tasks: Array<TaskType>,
    todolistId: string
}

type ActionTypes =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTotodlistActionType
    | RemoveTodoListActionType
    | AddTodolistForTasksActionType
    | SetTodolistsActionType
    | SetTasksActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionTypes): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            // const stateCopy = {...state}
            // const tasks = state[action.todoListId]
            // const filteredTasks = tasks.filter(t => t.id !== action.taskId)
            // stateCopy[action.todoListId] = filteredTasks
            // return stateCopy

            const stateCopy = {...state}  //для storybook
            const tasks = state[action.todoListId]
            if (tasks) {
                const filteredTasks = tasks.filter(t => t.id !== action.taskId)
                stateCopy[action.todoListId] = filteredTasks
            }
            return stateCopy
        }
        case 'ADD-TASK': {
            let newTask = action.task
            const stateCopy = {...state}
            const tasks = stateCopy[action.task.todoListId]
            const newTasks = [newTask, ...tasks]
            stateCopy[action.task.todoListId] = newTasks
            return stateCopy
        }

        case 'CHANGE-TASK-STATUS': {
            // const stateCopy = {...state}
            // const tasks = stateCopy[action.todoListId]
            // stateCopy[action.todoListId] = tasks.map(t=> t.id === action.taskId ? {...t, isDone: action.isDone} : t)
            // return stateCopy

            const stateCopy = {...state}  //для storybook
            const tasks = stateCopy[action.todoListId]
            if (tasks) {
                stateCopy[action.todoListId] = tasks.map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            }
            return stateCopy
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(task => task.id === action.taskId ? {
                        ...task,
                        title: action.title
                    }
                    : task)
            };
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []
            return stateCopy
        }
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
        case "SET-TASKS": {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }

        default:
            return state
    }

}

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todoListId, taskId}
}

export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todoListId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, status, todoListId}
}

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todoListId}
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

export const fetchTasksTC = (todolistId: string): any => async (dispatch: Dispatch<SetTasksActionType>) => {
    try {
        const result = await todolistsApi.getTasks(todolistId)
        dispatch(setTasksAC(result.data.items, todolistId))
    } catch (e) {
        console.log(e)
    }
}

export const removeTaskTC = (taskId: string, todolistId: string): any => async (dispatch: Dispatch) => {
    try {
        await todolistsApi.deleteTask(todolistId, taskId)
        dispatch(removeTaskAC(taskId, todolistId))
    }
    catch (e) {
        console.log(e)
    }
}

export const addTaskTC = (title: string, todoListId: string): any => async (dispatch: Dispatch) => {
    try {
        const result = await todolistsApi.createTask(todoListId, title)
        dispatch(addTaskAC(result.data.data.item))
    }
    catch (e) {
        console.log(e)
    }
}