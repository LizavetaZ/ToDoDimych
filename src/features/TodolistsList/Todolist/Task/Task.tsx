import React, {ChangeEvent, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootState, useAppDispatch} from "../../../../app/store";
import {removeTaskTC, updateTaskTC} from "../../tasks-reducer";
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolists-Api";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useAppDispatch()
    const tasks = useSelector<AppRootState, Array<TaskType>>(state => state.tasks[props.todolistId])

    const onRemoveHandler = () => {
        dispatch(removeTaskTC({ taskId: props.task.id, todolistId: props.todolistId }));
    }

    const onChangeStatusHandler = useCallback ((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(updateTaskTC(props.task.id, {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New}, props.todolistId))
    }, [props.task.id, props.todolistId])

    const onChangeTitleHandler = useCallback ((newValue: string) => {
        dispatch(updateTaskTC(props.task.id, {title: newValue}, props.todolistId))
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