import React, {useReducer, useState} from 'react';
// import './App.css';
// import {TasksType, ToDoList} from "./ToDoList";
// import {v1} from "uuid";
// import {AddItemForm} from "./AddItemForm";
// import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
// import {Menu} from "@mui/icons-material";
// import {
//     addTaskAC,
//     addTodolistForTasksAC,
//     changeTaskStatusAC,
//     changeTaskTitleAC,
//     removeTaskAC,
//     tasksReducer
// } from "./state/tasks-reducer";
// import {
//     addTodolistAC,
//     changeTotodlistFilterAC,
//     changeTotodlistTitleAC,
//     removeTodolistAC,
//     todolistsReducer
// } from "./state/todolists-reducer";

// export type FilterValuesType = 'all' | 'completed' | 'active'
//
// export type TodolistType = {
//     id: string,
//     title: string,
//     filter: FilterValuesType
// }
//
// export type TasksStateType = {
//     [key: string]: Array<TasksType>
// }
//
// function AppWithReducers() {
//
//     function changeFilter(value: FilterValuesType, todolistID: string) {
//         dispatchToDoListsReducer(changeTotodlistFilterAC(value, todolistID))
//     }
//
//
//     function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
//         dispatchToTasksReducer(changeTaskStatusAC(taskId, isDone, todolistId))
//     }
//
//     function removeTask(id: string, todolistId: string) {
//         dispatchToTasksReducer(removeTaskAC(id, todolistId))
//     }
//
//     function addTask(title: string, todolistId: string) {
//         dispatchToTasksReducer(addTaskAC(title, todolistId))
//     }
//
//     let toDoList1 = v1()
//     let toDoList2 = v1()
//
//     let [todoLists, dispatchToDoListsReducer] = useReducer(todolistsReducer, [
//         {id: toDoList1, title: 'What to learn', filter: 'all'},
//         {id: toDoList2, title: 'What to by', filter: 'all'}
//     ])
//
//     function removeToDoList(todolistId: string) {
//         dispatchToDoListsReducer(removeTodolistAC(todolistId))
//         dispatchToTasksReducer(removeTodolistAC(todolistId))
//     }
//
//     let [tasksObj, dispatchToTasksReducer] = useReducer(tasksReducer, {
//         [toDoList1]: [
//             {id: v1(), title: "CSS", isDone: true},
//             {id: v1(), title: "JS", isDone: true},
//             {id: v1(), title: "ReactJS", isDone: false},
//             {id: v1(), title: "Redux", isDone: false}],
//         [toDoList2]: [
//             {id: v1(), title: "Book", isDone: false},
//             {id: v1(), title: "Milk", isDone: true}]
//     })
//
//     function addToDoList(title: string) {
//         const todolistAction = addTodolistAC(title); // Generate todolist action
//         const todolistId = todolistAction.todolistId; // Get the todolistId from the action
//         dispatchToTasksReducer(addTodolistForTasksAC(todolistId));
//         dispatchToDoListsReducer(todolistAction);
//     }
//
//     function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
//         dispatchToTasksReducer(changeTaskTitleAC(taskId, newTitle, todolistId))
//     }
//
//     function changeToDoListTitle(todolistId: string, title: string) {
//         dispatchToDoListsReducer(changeTotodlistTitleAC(title, todolistId))
//     }
//
//     return (
//         <div className="App">
//             <AppBar position='static'>
//                 <Toolbar>
//                     <IconButton edge={"start"} color={"inherit"} aria-label={'menu'}>
//                         <Menu/>
//                     </IconButton>
//                     <Typography variant={"h6"}>
//                         News
//                     </Typography>
//                     <Button color={"inherit"}>Login</Button>
//                 </Toolbar>
//             </AppBar>
//             <Container fixed>
//                 <Grid container style = {{padding:'20px'}}>
//                     <AddItemForm addItem={addToDoList}/>
//                 </Grid>
//                 <Grid container spacing={3}>
//                     {
//                         todoLists.map((tl) => {
//                             let tasksForToDoList = tasksObj[tl.id]
//                             if (tl.filter === 'completed') {
//                                 tasksForToDoList = tasksForToDoList.filter(t => t.isDone === true)
//                             }
//                             if (tl.filter === 'active') {
//                                 tasksForToDoList = tasksForToDoList.filter(t => t.isDone === false)
//                             }
//                             return (
//                                 <Grid item>
//                                     <Paper style = {{padding:'10px'}}>
//                                     <ToDoList id={tl.id}
//                                               key={tl.id}
//                                               title={tl.title}
//                                               tasks={tasksForToDoList}
//                                               removeTask={removeTask}
//                                               changeFilter={changeFilter}
//                                               addTask={addTask}
//                                               changeTaskStatus={changeStatus}
//                                               filter={tl.filter}
//                                               removeToDoList={removeToDoList}
//                                               changeTaskTitle={changeTaskTitle}
//                                               changeToDoListTitle={changeToDoListTitle}
//                                     /></Paper></Grid>)
//                         })
//                     }
//                 </Grid>
//             </Container>
//         </div>
//     );
// }
//
// export default AppWithReducers;
