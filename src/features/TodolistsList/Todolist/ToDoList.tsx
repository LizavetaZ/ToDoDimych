import React, {useCallback} from "react";
import {AddItemForm} from "components/AddItemForm/AddItemForm";
import {EditableSpan} from "components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootState, useActions} from "app/store";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "api/todolists-Api";
import {ToDoListDomainType} from "../todolists-reducer";
import {tasksActions, todolistsActions} from "features/TodolistsList/index";

type ToDoListType = {
    todolist: ToDoListDomainType
    demo?: boolean;
}

export const ToDoList = React.memo(({demo, ...props}: ToDoListType) => {
    console.log('todo')
    // const dispatch = useAppDispatch()
    const {changeTodolistFilter, removeTodolistTC, changeTodolistTitleTC, addTodolistTC} = useActions(todolistsActions)

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolist.id])

    const {addTask} = useActions(tasksActions)

    const onAllClickHandler = useCallback(() => changeTodolistFilter({filter: 'all', id: props.todolist.id}), [props.todolist.id])
    const onActiveClickHandler = useCallback(() => changeTodolistFilter({filter: 'active', id: props.todolist.id}), [props.todolist.id])
    const onCompletedClickHandler = useCallback(() => changeTodolistFilter({filter: 'completed', id: props.todolist.id}), [props.todolist.id])

    const removeToDoList = () => {
        removeTodolistTC(props.todolist.id)
    }

    const changeToDoListTitle = useCallback((title: string) => {
        changeTodolistTitleTC({todolistId: props.todolist.id, title})
    }, [props.todolist.id])

    let tasksForToDoList = tasks
    if (props.todolist.filter === 'completed') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.Completed)
    }
    if (props.todolist.filter === 'active') {
        tasksForToDoList = tasksForToDoList.filter(t => t.status === TaskStatuses.New)
    }

    const addTaskForItemForm = useCallback((title: string) => {
        addTask({title, todoListId: props.todolist.id})
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

