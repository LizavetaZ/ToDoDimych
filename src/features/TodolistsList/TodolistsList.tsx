import React, {useCallback, useEffect} from 'react'
import {useSelector} from "react-redux";
import {AppRootState, useActions, useAppDispatch} from "app/store";
import {FilterValuesType, ToDoListDomainType} from "./todolists-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm, AddItemFormSubmitHelperType} from "components/AddItemForm/AddItemForm";
import {ToDoList} from "./Todolist/ToDoList";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {tasksActions, todolistsActions} from "features/TodolistsList/index";

type PropsType = {
    demo?: boolean;
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const dispatch = useAppDispatch()

    const todoLists = useSelector<AppRootState, Array<ToDoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {addTodolistTC, fetchTodolistsTC} = useActions(todolistsActions)

    const addTodolistCallback = useCallback(async (title: string, helpers: AddItemFormSubmitHelperType) => {
        let thunk = todolistsActions.addTodolistTC(title)
        const resultAction = await dispatch(thunk)
        if (todolistsActions.addTodolistTC.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload?.errors[0]
                helpers.setError(errorMessage)
            } else {
                helpers.setError('Some error occured')
            }
        } else {
            helpers.setnewTaskTitle('')
        }
    }, [])

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolistsTC()
    }, [])


    if (!isLoggedIn) {
        return <Navigate replace to="/login"/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolistCallback}/>
            </Grid>
            <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
                {
                    todoLists.map((tl) => {
                        return (
                            <Grid item key={tl.id}>
                                <div style={{width: '300px'}}>
                                    <ToDoList
                                        key={tl.id}
                                        todolist={tl}
                                        demo={demo}/>
                                </div>
                            </Grid>)
                    })
                }
            </Grid>
        </>
    )
        ;
};