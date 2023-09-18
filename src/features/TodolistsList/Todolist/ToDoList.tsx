import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskTC, fetchTasksTC} from "../tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "../../../app/store";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-Api";
import {FilterValuesType} from "../todolists-reducer";

type ToDoListType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    filter: FilterValuesType
    removeToDoList: (todolistId: string) => void
    changeToDoListTitle: (todolistId: string, title: string) => void
}

export const ToDoList = React.memo((props: ToDoListType) => {
    console.log('todo')
    const dispatch = useDispatch()

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.id])

    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    }, [])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.id), [props.changeFilter, props.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.id), [props.changeFilter, props.id])

    const removeToDoList = () => {
        props.removeToDoList(props.id)
    }

    const changeToDoListTitle = useCallback((title: string) => {
        props.changeToDoListTitle(props.id, title)
    }, [props.id, props.changeToDoListTitle])

    let tasksForToDoList = tasks
    if (props.filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.Completed)
    }
    if (props.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.New)
    }

    const addTaskForItemForm = useCallback((title: string) => {
        dispatch(addTaskTC(title, props.id))
    }, [props.id])

    return (
        <div>
            <h3><EditableSpan title={props.title} onChange={changeToDoListTitle}/>
                <IconButton onClick={removeToDoList}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={addTaskForItemForm}/>
            <div>
                {tasksForToDoList.map(task => (
                    <Task todolistId={props.id} key={task.id} task={task} />
                ))}
            </div>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>All
                </Button>
                <Button variant={props.filter === 'active' ? 'contained' : 'text'} color={"primary"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button variant={props.filter === 'completed' ? 'contained' : 'text'} color={"secondary"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})

