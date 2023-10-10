import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {addTaskTC, fetchTasksTC} from "../tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "../../../app/store";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-Api";
import {FilterValuesType, ToDoListDomainType} from "../todolists-reducer";

type ToDoListType = {
    todolist: ToDoListDomainType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    removeToDoList: (todolistId: string) => void
    changeToDoListTitle: (todolistId: string, title: string) => void
    demo?: boolean;
}

export const ToDoList = React.memo(({demo, ...props}: ToDoListType) => {
    console.log('todo')
    const dispatch = useAppDispatch()

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolist.id])

    // useEffect(() => {
    //     if(demo) {
    //         return
    //     }
    //     dispatch(fetchTasksTC(props.todolist.id))
    // }, [])

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.todolist.id), [props.changeFilter, props.todolist.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter('active', props.todolist.id), [props.changeFilter, props.todolist.id])
    const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', props.todolist.id), [props.changeFilter, props.todolist.id])

    const removeToDoList = () => {
        props.removeToDoList(props.todolist.id)
    }

    const changeToDoListTitle = useCallback((title: string) => {
        props.changeToDoListTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeToDoListTitle])

    let tasksForToDoList = tasks
    if (props.todolist.filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.Completed)
    }
    if (props.todolist.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.New)
    }

    const addTaskForItemForm = useCallback((title: string) => {
        dispatch(addTaskTC(title, props.todolist.id))
    }, [props.todolist.id])

    return (
        <div>
            <h3><EditableSpan title={props.todolist.title} onChange={changeToDoListTitle}/>
                <IconButton onClick={removeToDoList} disabled={props.todolist.entityStatus === 'loading'}><Delete/></IconButton>
            </h3>
            <AddItemForm addItem={addTaskForItemForm} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {tasksForToDoList.map(task => (
                    <Task todolistId={props.todolist.id} key={task.id} task={task} />
                ))}
            </div>
            <div>
                <Button variant={props.todolist.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>All
                </Button>
                <Button variant={props.todolist.filter === 'active' ? 'contained' : 'text'} color={"primary"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button variant={props.todolist.filter === 'completed' ? 'contained' : 'text'} color={"secondary"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})

