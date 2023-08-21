import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./AppWithRedux";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";

type ToDoListType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    filter: FilterValuesType
    removeToDoList: (todolistId: string) => void
    changeToDoListTitle:(todolistId: string, title: string) => void
}
export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}


export const ToDoList = (props: ToDoListType) => {
    console.log('todo')
    const dispatch = useDispatch()

    const tasks = useSelector<AppRootState, Array<TasksType>>(state => state.tasks[props.id])

    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onComplitedClickHandler = () => props.changeFilter('completed', props.id)

    const removeToDoList = () => {
        props.removeToDoList(props.id)
    }

    const changeToDoListTitle = (title:string) => {
        props.changeToDoListTitle(props.id, title)
    }

    let tasksForToDoList = tasks
    if (props.filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === true)
    }
    if (props.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === false)
    }

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={changeToDoListTitle}/>
                <IconButton onClick={removeToDoList}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={(title) => {dispatch(addTaskAC(title, props.id))}}/>
            <div>
                {
                    tasksForToDoList.map(task => {
                        const onRemoveHandler = () => {
                            dispatch(removeTaskAC(task.id, props.id))
                        }

                        const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            let newIsDoneValue = e.currentTarget.checked
                            dispatch(changeTaskStatusAC(task.id, newIsDoneValue, props.id))
                        }

                        const onChangeTitleHandler = (newValue: string) => {
                            dispatch(changeTaskTitleAC(task.id, newValue, props.id))
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

