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

    const {removeTask, updateTask} = useActions(tasksActions)

    const onRemoveHandler = () => {
        removeTask({ taskId: props.task.id, todolistId: props.todolistId })
    }

    const onChangeStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        updateTask({taskId: props.task.id, domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New}, todoListId: props.todolistId})
    }, [props.task.id, props.todolistId])

    const onChangeTitleHandler = useCallback ((newValue: string) => {
        updateTask({taskId: props.task.id, domainModel: {title: newValue}, todoListId: props.todolistId})
    }, [props.task.id, props.todolistId])

    return (
        <div key={props.task.id} style = {{position: 'relative'}} className={props.task.status===TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeStatusHandler}/>
            <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
            <IconButton size = {"small"} onClick={onRemoveHandler} style = {{position: 'absolute', right: '2px', top: '2px'}}><Delete fontSize={'small'}/>
            </IconButton>
        </div>
    )
})