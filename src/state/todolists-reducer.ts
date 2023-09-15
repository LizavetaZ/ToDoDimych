import {v1} from "uuid";
import {todolistsApi, ToDoListType} from "../api/todolists-Api";
import {Dispatch} from 'redux';


export type FilterValuesType = 'all' | 'completed' | 'active'

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

export type SetTodolistsActionType =  {type: 'SET-TODOLISTS',
    todolists: Array<ToDoListType>}

export type ToDoListDomainType = ToDoListType & {
    filter: FilterValuesType
}


type ActionTypes =
    RemoveTodoListActionType
    | AddTotodlistActionType
    | ChangeTotodlistFilterActionType
    | ChangeTotodlistTitleActionType
    | SetTodolistsActionType


const initialState: Array<ToDoListDomainType> = []


export const todolistsReducer = (state: Array<ToDoListDomainType> = initialState, action: ActionTypes): Array<ToDoListDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate: '',
                order: 0
            }, ...state]
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
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl =>{
                return {...tl, filter: 'all'}
            } )
        }
        default:
            return state
    }

}

export const removeTodolistAC = (tidoListId: string): RemoveTodoListActionType => {
    return ({type: 'REMOVE-TODOLIST', id: tidoListId}) as const
}

export const addTodolistAC = (title: string): AddTotodlistActionType => {
    const todolistId = v1()
    return ({type: 'ADD-TODOLIST', title, todolistId: todolistId}) as const
}

export const changeTotodlistTitleAC = (title: string, id: string): ChangeTotodlistTitleActionType => {
    return ({type: 'CHANGE-TODOLIST-TITLE', title: title, id: id}) as const
}

export const changeTotodlistFilterAC = (filter: FilterValuesType, id: string): ChangeTotodlistFilterActionType => {
    return ({type: 'CHANGE-TODOLIST-FILTER', filter: filter, id: id}) as const
}


export const setTodolistsAC = (todolists: Array<ToDoListType>): SetTodolistsActionType => {
    return ({type: 'SET-TODOLISTS', todolists: todolists}) as const
}


export const fetchTodolistsTC = ():any => async (dispatch: Dispatch<any>) => {
    try {
        let result = await todolistsApi.getToDoLists();
        dispatch(setTodolistsAC(result.data));
    } catch (e) {
        console.log(e);
    }
};