import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: AddItemFormPropsType) => {
    console.log('addItemForm')
    const [newTaskTitle, setnewTaskTitle] = useState('')
    const [error, setError] = useState<string | null>(null)


    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setnewTaskTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null)
        }
        if (e.charCode === 13) {
            addTask();
            setnewTaskTitle('')
        }
    }
    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            addItem(newTaskTitle.trim());
            setnewTaskTitle('')
        } else {
            setError('Title is required!')
        }
    }

    return (
        <div>
            <TextField value={newTaskTitle}
                       disabled = {disabled}
                       variant = {"outlined"}
                       label = {'Type value'}
                   onChange={onNewTitleChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
            helperText={error}/>
            <IconButton onClick={addTask} color = {"primary"} disabled={disabled}><ControlPoint/></IconButton>
        </div>
    )
})