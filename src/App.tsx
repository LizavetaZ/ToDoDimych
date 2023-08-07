import React, {useState} from 'react';
import './App.css';
import {TasksType, ToDoList} from "./ToDoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TasksType>
}

function App() {

    function changeFilter(value: FilterValuesType, todolistID: string) {
        let todoList = todoLists.find(tl => tl.id === todolistID)
        if (todoList) {
            todoList.filter = value
            setToDoLists([...todoLists])
        }
    }


    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        let tasks = tasksObj[todolistId]
        let task = tasks.find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            setTasks({...tasksObj})
        }

    }

    function removeTask(id: string, todolistId: string) {
        let tasks = tasksObj[todolistId]
        let filteredTasks = tasks.filter(t => t.id !== id)
        tasksObj[todolistId] = filteredTasks
        setTasks({...tasksObj})
    }

    function addTask(title: string, todolistId: string) {
        let newTask = {id: v1(), title: title, isDone: false}
        let tasks = tasksObj[todolistId]
        let newTasks = [newTask, ...tasks]
        tasksObj[todolistId] = newTasks
        setTasks({...tasksObj})
    }

    let toDoList1 = v1()
    let toDoList2 = v1()

    let [todoLists, setToDoLists] = useState<Array<TodolistType>>([
        {id: toDoList1, title: 'What to learn', filter: 'all'},
        {id: toDoList2, title: 'What to by', filter: 'all'}
    ])

    function removeToDoList(todolistId: string) {
        let filteredToDoList = todoLists.filter(tl => tl.id !== todolistId)
        setToDoLists(filteredToDoList)
        delete tasksObj[todolistId]
        setTasks({...tasksObj})
    }

    let [tasksObj, setTasks] = useState<TasksStateType>({
        [toDoList1]: [
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: false}],
        [toDoList2]: [
            {id: v1(), title: "Book", isDone: false},
            {id: v1(), title: "Milk", isDone: true}]
    })

    function addToDoList(title: string) {
        let toDoList: TodolistType = {
            id: v1(),
            filter: "all",
            title: title
        }
        setToDoLists([toDoList, ...todoLists])
        setTasks({...tasksObj, [toDoList.id]: []})
    }

    function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
        let tasks = tasksObj[todolistId]
        let task = tasks.find(t => t.id === taskId)
        if (task) {
            task.title = newTitle
            setTasks({...tasksObj})
        }
    }

    function changeToDoListTitle(todolistId: string, title: string) {
        const todolist = todoLists.find(t => t.id === todolistId)
        if (todolist) {
            todolist.title = title
            setToDoLists([...todoLists])
        }
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
                            let tasksForToDoList = tasksObj[tl.id]
                            if (tl.filter === 'completed') {
                                tasksForToDoList = tasksForToDoList.filter(t => t.isDone === true)
                            }
                            if (tl.filter === 'active') {
                                tasksForToDoList = tasksForToDoList.filter(t => t.isDone === false)
                            }
                            return (
                                <Grid item>
                                    <Paper style = {{padding:'10px'}}>
                                    <ToDoList id={tl.id}
                                              key={tl.id}
                                              title={tl.title}
                                              tasks={tasksForToDoList}
                                              removeTask={removeTask}
                                              changeFilter={changeFilter}
                                              addTask={addTask}
                                              changeTaskStatus={changeStatus}
                                              filter={tl.filter}
                                              removeToDoList={removeToDoList}
                                              changeTaskTitle={changeTaskTitle}
                                              changeToDoListTitle={changeToDoListTitle}
                                    /></Paper></Grid>)
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
