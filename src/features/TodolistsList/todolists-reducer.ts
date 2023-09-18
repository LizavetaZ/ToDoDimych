import {todolistsApi, ToDoListType} from "../../api/todolists-Api";
import {Dispatch} from 'redux';

const initialState: Array<ToDoListDomainType> = []

export const todolistsReducer = (state: Array<ToDoListDomainType> = initialState, action: ActionTypes): Array<ToDoListDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
           return  state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return  state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl =>{
                return {...tl, filter: 'all'}
            } )

        default:
            return state
    }

}


//actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)

export const addTodolistAC = (todolist: ToDoListType)=> ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTotodlistTitleAC = (id: string, title: string)=> ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)

export const changeTotodlistFilterAC = (filter: FilterValuesType, id: string)=> ({type: 'CHANGE-TODOLIST-FILTER', filter, id} as const)

export const setTodolistsAC = (todolists: Array<ToDoListType>)=> ({type: 'SET-TODOLISTS', todolists} as const)

//thunks
export const fetchTodolistsTC = ():any => async (dispatch: Dispatch<ActionTypes>) => {
    try {
        let result = await todolistsApi.getToDoLists();
        dispatch(setTodolistsAC(result.data));
    } catch (e) {
        console.log(e);
    }
};

export const removeTodolistTC = (todolistId: string):any => async (dispatch: Dispatch<ActionTypes>) => {
    try {
        await todolistsApi.deleteToDoList(todolistId);
        dispatch(removeTodolistAC(todolistId));
    } catch (e) {
        console.log(e);
    }
};

export const addTodolistTC = (title: string):any => async (dispatch: Dispatch<ActionTypes>) => {
    try {
        const result = await todolistsApi.createToDoList(title);
        dispatch(addTodolistAC(result.data.data.item));
    } catch (e) {
        console.log(e);
    }
};

export const changeTotodlistTitleTC = (todolistId: string, title: string):any => async (dispatch: Dispatch<ActionTypes>) => {
    try {
        await todolistsApi.updateToDoList(todolistId,title);
        dispatch(changeTotodlistTitleAC(todolistId,title));
    } catch (e) {
        console.log(e);
    }
};

//types
export type FilterValuesType = 'all' | 'completed' | 'active'

export type ToDoListDomainType = ToDoListType & {
    filter: FilterValuesType
}

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionTypes =
    RemoveTodoListActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTotodlistTitleAC>
    | ReturnType<typeof changeTotodlistFilterAC>
    | SetTodolistsActionType