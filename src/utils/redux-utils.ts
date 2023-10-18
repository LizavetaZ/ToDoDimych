import {ActionCreatorsMapObject, AnyAction, bindActionCreators} from "redux";
import {useMemo} from "react";
import {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppRootState} from "utils/types";

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T){
    const dispatch = useAppDispatch()
    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])
    return boundActions
}

export type DispatchType = ThunkDispatch<AppRootState, any, AnyAction>
export const useAppDispatch = () =>  useDispatch<DispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector