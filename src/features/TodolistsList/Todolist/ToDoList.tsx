import React, {useCallback} from "react";
import {AddItemForm} from "components/AddItemForm/AddItemForm";
import {EditableSpan} from "components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {AppRootState, useActions} from "app/store";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "api/todolists-Api";
import {FilterValuesType, ToDoListDomainType} from "../todolists-reducer";
import {tasksActions, todolistsActions} from "features/TodolistsList";

type ToDoListType = {
    todolist: ToDoListDomainType
    demo?: boolean;
}

type ButtonOwnPropsType = "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning" | undefined

export const ToDoList = React.memo(({demo, ...props}: ToDoListType) => {
    console.log('todo')
    const dispatch = useAppDispatch()
    const {changeTodolistFilter, removeTodolistTC, changeTodolistTitleTC, addTodolistTC} = useActions(todolistsActions)

    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolist.id])

    const {addTask} = useActions(tasksActions)

    const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({filter, id: props.todolist.id}), [props.todolist.id])

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

    const addTaskForItemForm = useCallback(async (title: string) => {
        let thunk = tasksActions.addTask({title, todoListId: props.todolist.id})
        const resultAction = await dispatch(thunk)

        if (tasksActions.addTask.rejected.match(resultAction)){
            if (resultAction.payload?.fieldsErrors?.length) {
                const errorMessage = resultAction.payload?.fieldsErrors[0]
                throw new Error(errorMessage)
            }
            else {
                throw new Error('Some error occured')
            }
        }


    }, [props.todolist.id])

    const renderFilterButton = (buttonFilter: FilterValuesType,
                                color: ButtonOwnPropsType,
                                text: string) => {
        return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                       onClick={() => onFilterButtonClickHandler(buttonFilter)}
                       color={color}>{text}
        </Button>
    }

    return (
        <Paper style={{padding: '10px',position: 'relative'}}>
            <IconButton onClick={removeToDoList} disabled={props.todolist.entityStatus === 'loading'} style = {{position: 'absolute', right: '5px', top: '5px'}}><Delete/></IconButton>
            <h3><EditableSpan title={props.todolist.title} onChange={changeToDoListTitle}/>
            </h3>
            <AddItemForm addItem={addTaskForItemForm} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {tasksForToDoList.map(task => (
                    <Task todolistId={props.todolist.id} key={task.id} task={task} />
                ))}
                {!tasksForToDoList.length && <div style={{fontStyle: 'italic', fontSize:'13px', color: 'grey', padding: '10px'}}>No tasks</div>}
            </div>
            <div>
                {renderFilterButton('all', 'inherit',  'All')}
                {renderFilterButton('active', 'primary',  'Active')}
                {renderFilterButton('completed', 'secondary',  'Completed')}
            </div>
        </Paper>
    )
})

