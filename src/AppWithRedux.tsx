import React, {useCallback, useEffect} from 'react';
import './App.css';
import {ToDoList} from "./ToDoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    addTodolistTC,
    changeTotodlistFilterAC,
    changeTotodlistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    ToDoListDomainType
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {TaskType} from "./api/todolists-Api";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {

    console.log('app')

    const dispatch = useDispatch()

    const todoLists = useSelector<AppRootState, Array<ToDoListDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    const changeFilter = useCallback ((value: FilterValuesType, todolistID: string) => {
        dispatch(changeTotodlistFilterAC(value, todolistID))
    }, [dispatch])

    //
    // const changeStatus = useCallback ((taskId: string, status: TaskStatuses, todolistId: string) => {
    //     dispatch(changeTaskStatusAC(taskId, status, todolistId))
    // },[dispatch])

    // const removeTask = useCallback ((id: string, todolistId: string) => {
    //     dispatch(removeTaskAC(id, todolistId))
    // },[dispatch])

    // const addTask = useCallback ((title: string, todolistId: string) => {
    //     dispatch(addTaskAC(title, todolistId))
    // },[dispatch])



    const removeToDoList = useCallback ((todolistId: string) => {
        // const action = removeTodolistAC(todolistId)
        dispatch(removeTodolistTC(todolistId))
    },[dispatch])


    const addToDoList = useCallback((title: string) => {
        // const action = addTodolistAC(title)
        dispatch(addTodolistTC(title));
    }, [dispatch])

    // function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
    //     dispatch(changeTaskTitleAC(taskId, newTitle, todolistId))
    // }

    const changeToDoListTitle = useCallback ((todolistId: string, title: string) => {
        dispatch(changeTotodlistTitleTC(todolistId, title))
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge={"start"} color={"inherit"} aria-label={'menu'}>
                        <Menu/>
                    </IconButton>
                    <Typography variant={"h6"}>
                        News
                    </Typography>
                    <Button color={"inherit"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style = {{padding:'20px'}}>
                    <AddItemForm addItem={addToDoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map((tl) => {
                            return (
                                <Grid item key={tl.id}>
                                    <Paper style = {{padding:'10px'}}>
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
            </Container>
        </div>
    );
}

export default AppWithRedux;
