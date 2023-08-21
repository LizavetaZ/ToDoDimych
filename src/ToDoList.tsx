import React, {useCallback} from "react";
import {FilterValuesType} from "./AppWithRedux";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {Task} from "./Task";

type ToDoListType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    filter: FilterValuesType
    removeToDoList: (todolistId: string) => void
    changeToDoListTitle: (todolistId: string, title: string) => void
}
export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}


export const ToDoList = React.memo((props: ToDoListType) => {
    console.log('todo')
    const dispatch = useDispatch()

    const tasks = useSelector<AppRootState, Array<TasksType>>(state => state.tasks[props.id])

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
        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === true)
    }
    if (props.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.isDone === false)
    }

    const addTaskForItemForm = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.id))
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

