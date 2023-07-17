import React, {useState} from 'react';
import './App.css';
import {TasksType, ToDoList} from "./ToDoList";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TodolistType = {
    id: string,
    title: string,
    filter: FilterValuesType
}

function App() {

    function changeFilter(value: FilterValuesType, todolistID: string) {
        let todoList = todoLIsts.find(tl => tl.id === todolistID)
        if (todoList) {
            todoList.filter = value
            setToDoLists([...todoLIsts])
        }
    }


    function changeStatus(taskId: string, isDone: boolean, todolistId:string) {
        let tasks = tasksObj[todolistId]
        let task = tasks.find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            tasksObj[todolistId] = tasks
            setTasks({...tasksObj})
        }

    }

    function removeTask(id: string, todolistId:string) {
        let tasks = tasksObj[todolistId]
        let filteredTasks = tasks.filter(t => t.id !== id)
        tasksObj[todolistId] = filteredTasks
        setTasks({...tasksObj})
    }

    function addTask(title: string, todolistId:string) {
        let newTask = {id: v1(), title: title, isDone: false}
        let tasks = tasksObj[todolistId]
        let newTasks = [newTask, ...tasks]
        tasksObj[todolistId] = newTasks
        setTasks({...tasksObj})
    }

    let toDoList1 = v1()
    let toDoList2 = v1()

    let [todoLIsts, setToDoLists] = useState<Array<TodolistType>>([
        {id: toDoList1, title: 'What to learn', filter: 'active'},
        {id: toDoList2, title: 'What to by', filter: 'completed'}
    ])

    function removeToDoList(todolistId:string) {
        let filteredToDoList = todoLIsts.filter(tl => tl.id !== todolistId)
        setToDoLists(filteredToDoList)
        delete tasksObj[todolistId]
        setTasks({...tasksObj})
    }

    let [tasksObj, setTasks] = useState({
        [toDoList1]: [
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Redux", isDone: false}],
        [toDoList2]: [
            {id: v1(), title: "Book", isDone: false},
            {id: v1(), title: "Milk", isDone: true}]
    })



    return (
        <div className="App">
            {
                todoLIsts.map((tl) => {
                    let tasksForToDoList = tasksObj[tl.id]
                    if (tl.filter === 'completed') {
                        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === true)
                    }
                    if (tl.filter === 'active') {
                        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === false)
                    }
                    return <ToDoList id={tl.id}
                                     key={tl.id}
                                     title={tl.title}
                                     tasks={tasksForToDoList}
                                     removeTask={removeTask}
                                     changeFilter={changeFilter}
                                     addTask={addTask}
                                     changeTaskStatus={changeStatus}
                                     filter={tl.filter}
                                     removeToDoList = {removeToDoList}
                    />
                })
            }
        </div>
    );
}

export default App;
