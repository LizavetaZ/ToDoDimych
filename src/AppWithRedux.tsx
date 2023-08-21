import React from 'react';
import './App.css';
import {TasksType, ToDoList} from "./ToDoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    addTodolistAC,
    changeTotodlistFilterAC,
    changeTotodlistTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TasksType>
}

function AppWithRedux() {

    console.log('app')

    const dispatch = useDispatch()

    const todoLists = useSelector<AppRootState, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootState, TasksStateType>(state => state.tasks)

    function changeFilter(value: FilterValuesType, todolistID: string) {
        dispatch(changeTotodlistFilterAC(value, todolistID))
    }


    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        dispatch(changeTaskStatusAC(taskId, isDone, todolistId))
    }

    function removeTask(id: string, todolistId: string) {
        dispatch(removeTaskAC(id, todolistId))
    }

    function addTask(title: string, todolistId: string) {
        dispatch(addTaskAC(title, todolistId))
    }



    function removeToDoList(todolistId: string) {
        const action = removeTodolistAC(todolistId)
        dispatch(action)
    }


    function addToDoList(title: string) {
        const action = addTodolistAC(title)
        // const todolistAction = addTodolistAC(title); // Generate todolist action
        // const todolistId = todolistAction.todolistId; // Get the todolistId from the action
        // dispatch(addTodolistForTasksAC(todolistId));
        dispatch(action);
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId))
    }

    function changeToDoListTitle(todolistId: string, title: string) {
        dispatch(changeTotodlistTitleAC(title, todolistId))
    }

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
