import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType} from "./App";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

type ToDoListType = {
    id:string
    title: string
    tasks: Array<TasksType>
    removeTask: (id: string, todolistId:string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId:string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId:string) => void
    filter: FilterValuesType
    removeToDoList: (todolistId:string) => void
}
export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}


export const ToDoList = (props: ToDoListType) => {

    const [newTaskTitle, setnewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setnewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            props.addTask(newTaskTitle, props.id);
            setnewTaskTitle('')
        }
        setError(null)
    }
    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            props.addTask(newTaskTitle.trim(), props.id);
            setnewTaskTitle('')
        }
        else {
            setError('Title is required!')
        }
    }

    const onAllClickHandler = () => props.changeFilter('all', props.id)
    const onActiveClickHandler = () => props.changeFilter('active', props.id)
    const onComplitedClickHandler = () => props.changeFilter('completed', props.id)

    const removeToDoList = () => {
        props.removeToDoList(props.id)
    }

    return (
        <div>
            <h3>{props.title} <button onClick={removeToDoList}>x</button></h3>
            <div>
                <input value={newTaskTitle}
                       onChange={onNewTitleChangeHandler}
                       onKeyPress={onKeyPressHandler}
                className={error ? 'error' : ''}/>
                <button onClick={addTask}>+</button>
                {error && <div className={'error-message'}>{error}</div>}
            </div>
            <ul>
                {
                    props.tasks.map(task => {
                        const onRemoveHandler = () => {
                            props.removeTask(task.id, props.id)
                        }

                        const onChangeHandler = (e:ChangeEvent<HTMLInputElement>) => {props.changeTaskStatus(task.id, e.currentTarget.checked, props.id)}

                        return <li key={task.id} className={task.isDone ? 'is-done' : ''}>
                            <input type="checkbox" checked={task.isDone}
                            onChange={onChangeHandler}/>
                            <span>{task.title}</span>
                            <button onClick={onRemoveHandler}>x
                            </button>
                        </li>
                    })
                }

                {/*<li><input type="checkbox" checked={props.tasks[0].isDone}/> <span>{props.tasks[0].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.tasks[1].isDone}/> <span>{props.tasks[1].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.tasks[2].isDone}/> <span>{props.tasks[2].title}</span></li>*/}
            </ul>
            <div>
                {/*<button onClick={()=>props.changeFilter('all')}>ALL</button>*/}
                <button className={props.filter === 'all' ? 'active-filter' : ''} onClick={onAllClickHandler}>All</button>
                <button className={props.filter === 'active' ? 'active-filter' : ''} onClick={onActiveClickHandler}>Active</button>
                <button className={props.filter === 'completed' ? 'active-filter' : ''} onClick={onComplitedClickHandler}>Completed</button>
            </div>
        </div>
    )

}