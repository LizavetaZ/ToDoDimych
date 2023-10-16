import React, {ChangeEvent, useCallback} from "react";
import {useSelector} from "react-redux";
import {AppRootState, useActions, useAppDispatch} from "app/store";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "api/todolists-Api";
import {tasksActions} from "features/TodolistsList/index";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useAppDispatch()
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolistId])

    const {removeTaskTC, updateTaskTC} = useActions(tasksActions)

    const onRemoveHandler = () => {
        removeTaskTC({ taskId: props.task.id, todolistId: props.todolistId })
    }

    const onChangeStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        updateTaskTC({taskId: props.task.id, domainModel: {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}, todoListId: props.todolistId})
    }, [props.task.id, props.todolistId])

    const onChangeTitleHandler = useCallback ((newValue: string) => {
        updateTaskTC({taskId: props.task.id, domainModel: {title: newValue}, todoListId: props.todolistId})
    }, [props.task.id, props.todolistId])

    return (
        <li key={props.task.id} className={props.task.status===TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeStatusHandler}/>
            <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
            <IconButton onClick={onRemoveHandler}><Delete/>
            </IconButton>
        </li>
    )
})