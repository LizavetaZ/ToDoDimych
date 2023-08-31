import {TasksStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTotodlistActionType, RemoveTodoListActionType} from "./todolists-reducer";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todoListId: string,
    taskId: string
}
export type AddTaskActionType = {
    type: 'ADD-TASK',
    title: string,
    todoListId: string
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    taskId: string,
    isDone: boolean,
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

type ActionTypes =
    RemoveTaskActionType
    | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType | AddTotodlistActionType | RemoveTodoListActionType | AddTodolistForTasksActionType

const initialState : TasksStateType = {}

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
            let newTask = {id: v1(), title: action.title, isDone: false}
            const stateCopy = {...state}
            const tasks = stateCopy[action.todoListId]
            const newTasks = [newTask, ...tasks]
            stateCopy[action.todoListId] = newTasks
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
                stateCopy[action.todoListId] = tasks.map(t => t.id === action.taskId ? {...t, isDone: action.isDone} : t)
            }
            return stateCopy
        }
        case 'CHANGE-TASK-TITLE': {
            return {...state,
                [action.todoListId]: state[action.todoListId].map(task => task.id === action.taskId ? {...task, title: action.title}
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

        default:
            return state
    }

}

export const removeTaskAC = (taskId: string, todoListId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', todoListId, taskId}
}

export const addTaskAC = (title: string, todoListId: string): AddTaskActionType => {
    return {type: 'ADD-TASK', title, todoListId}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todoListId}
}

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todoListId}
}

export const addTodolistForTasksAC = (todolistId: string):AddTodolistForTasksActionType => {
    return {type: 'ADD-TODOLIST', todolistId}
}


