import React, {useReducer} from 'react';
import {TaskStatuses} from "../api/todolists-Api";
// import './App.css';
// import {ToDoList} from "./ToDoList";
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
// import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolists-Api";
//
// export type FilterValuesType = 'all' | 'completed' | 'active'
//
// export type TodolistType = {
//     id: string,
//     title: string,
//     filter: FilterValuesType
// }
//
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
//
// function AppWithReducers() {
//
//     function changeFilter(value: FilterValuesType, todolistID: string) {
//         dispatchToDoListsReducer(changeTotodlistFilterAC(value, todolistID))
//     }
//
//
//     function changeStatus(taskId: string, status: TaskStatuses, todolistId: string) {
//         dispatchToTasksReducer(updateTaskAC(taskId, {status}, todolistId))
//     }
//
//     function removeTask(id: string, todolistId: string) {
//         dispatchToTasksReducer(removeTaskAC(id, todolistId))
//     }
//
//     function addTask(title: string, todolistId: string) {
// const action = addTaskAC({
//                 id: 'id exists',
//                 title: title,
//                 status: TaskStatuses.New,
//                 description: '',
//                 priority: TaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 order: 0,
//                 addedDate: '',
//                 completed: false,
//                 todoListId:todolistId
//             })
//         dispatchToTasksReducer(action)
//     }
//
//     let toDoList1 = v1()
//     let toDoList2 = v1()
//
//
//     let [todoLists, dispatchToDoListsReducer] = useReducer(todolistsReducer, [
//         {id: toDoList1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
//         {id: toDoList2, title: 'What to by', filter: 'all', addedDate: '', order: 0}
//     ])
//
//     function removeToDoList(todolistId: string) {
//         dispatchToDoListsReducer(removeTodolistAC(todolistId))
//         dispatchToTasksReducer(removeTodolistAC(todolistId))
//     }
//
//     let [tasksObj, dispatchToTasksReducer] = useReducer(tasksReducer, {
//         [toDoList1]: [
//             {
//                 id: v1(),
//                 title: 'CSS',
//                 status: TaskStatuses.New,
//                 description: '',
//                 priority: TaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 order: 0,
//                 addedDate: '',
//                 completed: false,
//                 todoListId: toDoList1
//             },
//             {
//                 id: v1(),
//                 title: 'JS',
//                 status: TaskStatuses.New,
//                 description: '',
//                 priority: TaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 order: 0,
//                 addedDate: '',
//                 completed: false,
//                 todoListId:toDoList1
//             }],
//         [toDoList2]: [
//             {
//                 id: v1(),
//                 title: 'Milk',
//                 status: TaskStatuses.New,
//                 description: '',
//                 priority: TaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 order: 0,
//                 addedDate: '',
//                 completed: false,
//                 todoListId: toDoList2
//             },
//             {
//                 id: v1(),
//                 title: 'Bread',
//                 status: TaskStatuses.New,
//                 description: '',
//                 priority: TaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 order: 0,
//                 addedDate: '',
//                 completed: false,
//                 todoListId:toDoList2
//             }]
//     })
//
//     function addToDoList(title: string) {
//         const todolistAction = addTodolistAC({
// id: v1()
// title: title
// addedDate: ''
// order: 0
//         }); // Generate todolist action
//         const todolistId = todolistAction.todolistId; // Get the todolistId from the action
//         dispatchToTasksReducer(addTodolistForTasksAC(todolistId));
//         dispatchToDoListsReducer(todolistAction);
//     }
//
//     function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
//         dispatchToTasksReducer(updateTaskAC(taskId, {title:newTitle}, todolistId))
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
//                                 tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.Completed)
//                             }
//                             if (tl.filter === 'active') {
//                                 tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.New)
//                             }
//                             return (
//                                 <Grid item>
//                                     <Paper style = {{padding:'10px'}}>
//                                   <ToDoList id={tl.id}
//                                     key={tl.id}
//                                     title={tl.title}
//                                     tasks={tasksForToDoList}
//                                     removeTask={removeTask}
//                                     changeFilter={changeFilter}
//                                     addTask={addTask}
//                                     changeTaskStatus={changeStatus}
//                                     filter={tl.filter}
//                                    removeToDoList={removeToDoList}
//                                     changeTaskTitle={changeTaskTitle}
//                                  changeToDoListTitle={changeToDoListTitle}
//                                     />
//                                     </Paper></Grid>)
//                         })
//                     }
//                 </Grid>
//             </Container>
//         </div>
//     );
// }
//
// export default AppWithReducers;
