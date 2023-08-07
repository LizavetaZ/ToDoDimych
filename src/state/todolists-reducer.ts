import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";
export type RemoveTodoListActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTotodlistActionType = {
    type: 'ADD-TODOLIST',
    title: string,
    todolistId: string
}
export type ChangeTotodlistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    title: string
    id: string
}
export type ChangeTotodlistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionTypes =
    RemoveTodoListActionType
    | AddTotodlistActionType
    | ChangeTotodlistFilterActionType
    | ChangeTotodlistTitleActionType

export const todolistsReducer = (state: Array<TodolistType>, action: ActionTypes) : Array<TodolistType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el=> el.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [...state, {
                id: action.todolistId,
                filter: "all",
                title: action.title}]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(t => t.id === action.id)
            if (todolist) {
                todolist.title = action.title
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            let todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.filter = action.filter
            }
            return [...state]
        }
        default:
            throw new Error('I don\'t understand this action type')
    }

}

export const removeTodolistAC = (tidoListId: string):RemoveTodoListActionType => {
    return { type: 'REMOVE-TODOLIST', id: tidoListId}
}

export const addTodolistAC = (title: string):AddTotodlistActionType => {
    return {type: 'ADD-TODOLIST', title, todolistId: v1()}
}

export const  changeTotodlistTitleAC= (title: string, id: string):ChangeTotodlistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id: id}
}

export const  changeTotodlistFilterAC= (filter: FilterValuesType, id: string):ChangeTotodlistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: id}
}