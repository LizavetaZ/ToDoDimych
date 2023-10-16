import React, {useCallback, useEffect} from 'react'
import {useSelector} from "react-redux";
import {AppRootState, useActions, useAppDispatch} from "app/store";
import {changeTotodlistFilterAC, FilterValuesType, ToDoListDomainType} from "./todolists-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "components/AddItemForm/AddItemForm";
import {ToDoList} from "./Todolist/ToDoList";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {todolistsActions} from "features/TodolistsList/index";

type PropsType = {
    demo?: boolean;
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const dispatch = useAppDispatch()
    const todoLists = useSelector<AppRootState, Array<ToDoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {addTodolistTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} = useActions(todolistsActions)


    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolistsTC()
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistID: string) => {
        dispatch(changeTotodlistFilterAC({filter: value, id: todolistID}))
    }, [])


    const removeToDoList = useCallback((todolistId: string) => {
        removeTodolistTC({todolistId})
    }, [])


    const addToDoList = useCallback((title: string) => {
        addTodolistTC({title})
    }, [])


    const changeToDoListTitle = useCallback((todolistId: string, title: string) => {
        changeTodolistTitleTC({todolistId, title})
    }, [])

    if (!isLoggedIn) {
        return <Navigate replace to="/login" />
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addToDoList}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todoLists.map((tl) => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: '10px'}}>
                                    <ToDoList
                                              key={tl.id}
                                              todolist={tl} changeFilter={changeFilter}
                                              removeToDoList={removeToDoList}
                                              changeToDoListTitle={changeToDoListTitle}
                                   demo={demo} /></Paper></Grid>)
                    })
                }
            </Grid>
        </>
    )
        ;
};