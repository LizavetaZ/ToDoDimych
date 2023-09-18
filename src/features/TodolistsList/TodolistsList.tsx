import React, {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "../../app/store";
import {
    addTodolistTC,
    changeTotodlistFilterAC, changeTotodlistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    ToDoListDomainType
} from "./todolists-reducer";
import {TasksStateType} from "./tasks-reducer";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {ToDoList} from "./Todolist/ToDoList";

export const TodolistsList: React.FC = () => {
    const dispatch = useDispatch()

    const todoLists = useSelector<AppRootState, Array<ToDoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistID: string) => {
        dispatch(changeTotodlistFilterAC(value, todolistID))
    }, [])


    const removeToDoList = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))
    }, [])


    const addToDoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [])


    const changeToDoListTitle = useCallback((todolistId: string, title: string) => {
        dispatch(changeTotodlistTitleTC(todolistId, title))
    }, [])

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
                                    <ToDoList id={tl.id}
                                              key={tl.id}
                                              title={tl.title}
                                              changeFilter={changeFilter}
                                              filter={tl.filter}
                                              removeToDoList={removeToDoList}
                                              changeToDoListTitle={changeToDoListTitle}
                                    /></Paper></Grid>)
                    })
                }
            </Grid>
        </>
    )
        ;
};