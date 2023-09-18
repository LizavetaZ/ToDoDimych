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
    todolist: ToDoListType
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
            const newTodoList: ToDoListDomainType = {...action.todolist, filter: 'all'}
            return [newTodoList, ...state]
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

export const addTodolistAC = (todolist: ToDoListType): AddTotodlistActionType => {
    return ({type: 'ADD-TODOLIST', todolist}) as const
}

export const changeTotodlistTitleAC = (id: string, title: string): ChangeTotodlistTitleActionType => {
    return ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}) as const
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

export const removeTodolistTC = (todolistId: string):any => async (dispatch: Dispatch<any>) => {
    try {
        await todolistsApi.deleteToDoList(todolistId);
        dispatch(removeTodolistAC(todolistId));
    } catch (e) {
        console.log(e);
    }
};

export const addTodolistTC = (title: string):any => async (dispatch: Dispatch<any>) => {
    try {
        const result = await todolistsApi.createToDoList(title);
        dispatch(addTodolistAC(result.data.data.item));
    } catch (e) {
        console.log(e);
    }
};

export const changeTotodlistTitleTC = (todolistId: string, title: string):any => async (dispatch: Dispatch<any>) => {
    try {
        await todolistsApi.updateToDoList(todolistId,title);
        dispatch(changeTotodlistTitleAC(todolistId,title));
    } catch (e) {
        console.log(e);
    }
};