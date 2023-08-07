import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

type ToDoListType = {
    id: string
    title: string
    tasks: Array<TasksType>
    removeTask: (id: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    filter: FilterValuesType
    removeToDoList: (todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    changeToDoListTitle:(todolistId: string, title: string) => void
}
export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}


export const ToDoList = (props: ToDoListType) => {

    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onComplitedClickHandler = () => props.changeFilter('completed', props.id)

    const removeToDoList = () => {
        props.removeToDoList(props.id)
    }

    const changeToDoListTitle = (title:string) => {
        props.changeToDoListTitle(props.id, title)
    }

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={changeToDoListTitle}/>
                <IconButton onClick={removeToDoList}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>
            <div>
                {
                    props.tasks.map(task => {
                        const onRemoveHandler = () => {
                            props.removeTask(task.id, props.id)
                        }

                        const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeTaskStatus(task.id, e.currentTarget.checked, props.id)
                        }

                        const onChangeTitleHandler = (newValue: string) => {
                            props.changeTaskTitle(task.id, newValue, props.id)
                        }

                        return <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                            <Checkbox  checked={task.isDone}
                                   onChange={onChangeStatusHandler}/>
                            <EditableSpan title={task.title} onChange = {onChangeTitleHandler}/>
                            <IconButton onClick={onRemoveHandler}><Delete/>
                            </IconButton>
                        </li>
                    })
                }
            </div>
            <div>
                <Button variant = {props.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>All
                </Button>
                <Button variant = {props.filter === 'active' ? 'contained' : 'text'} color = {"primary"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button variant = {props.filter === 'completed' ? 'contained' : 'text'} color = {"secondary"}
                        onClick={onComplitedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
}

