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

type PropsType = {
    demo?: boolean;
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {

    const dispatch = useDispatch()
    const todoLists = useSelector<AppRootState, Array<ToDoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)

    useEffect(() => {
        if (demo) {
            return
        }
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