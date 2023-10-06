import {todolistsApi, ToDoListType} from "../../api/todolists-Api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerNetworkError} from "../../utils/error-utils";
import {ThunkType} from "../../app/store";

const initialState: Array<ToDoListDomainType> = []

export const todolistsReducer = (state: Array<ToDoListDomainType> = initialState, action: ActionTypes): Array<ToDoListDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
           return  state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return  state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl =>{
                return {...tl, filter: 'all', entityStatus: "idle"}
            } )
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return  state.map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
        default:
            return state
    }

}


//actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)

export const addTodolistAC = (todolist: ToDoListType)=> ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTotodlistTitleAC = (id: string, title: string)=> ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)

export const changeTotodlistFilterAC = (filter: FilterValuesType, id: string)=> ({type: 'CHANGE-TODOLIST-FILTER', filter, id} as const)

export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType)=> ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, status} as const)

export const setTodolistsAC = (todolists: Array<ToDoListType>)=> ({type: 'SET-TODOLISTS', todolists} as const)

//thunks
export const fetchTodolistsTC = ():ThunkType => async (dispatch) => {
    try {
        dispatch(setAppStatusAC({status:'loading'}))
        let result = await todolistsApi.getToDoLists();
        dispatch(setTodolistsAC(result.data));
        dispatch(setAppStatusAC({status:'succeeded'}))
    } catch (error: any) {
        handleServerNetworkError(error, dispatch)
    }
};

export const removeTodolistTC = (todolistId: string): ThunkType => async (dispatch) => {
    try {
        dispatch(setAppStatusAC({status:'loading'}))
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
        await todolistsApi.deleteToDoList(todolistId);
        dispatch(removeTodolistAC(todolistId));
        dispatch(setAppStatusAC({status:'succeeded'}))
    } catch (error) {
        console.log(error);
    }
};

export const addTodolistTC = (title: string):ThunkType => async (dispatch) => {
    try {
        dispatch(setAppStatusAC({status:'loading'}))
        const result = await todolistsApi.createToDoList(title);
        dispatch(addTodolistAC(result.data.data.item));
        dispatch(setAppStatusAC({status:'succeeded'}))
    } catch (error) {
        console.log(error);
    }
};

export const changeTotodlistTitleTC = (todolistId: string, title: string): ThunkType => async (dispatch) => {
    try {
        await todolistsApi.updateToDoList(todolistId,title);
        dispatch(changeTotodlistTitleAC(todolistId,title));
    } catch (error) {
        console.log(error);
    }
};

//types
export type FilterValuesType = 'all' | 'completed' | 'active'

export type ToDoListDomainType = ToDoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodoListActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

type ActionTypes =
    RemoveTodoListActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTotodlistTitleAC>
    | ReturnType<typeof changeTotodlistFilterAC>
    | SetTodolistsActionType
| changeTodolistEntityStatusACType


// type ThunkDispatch = Dispatch<ActionTypes>