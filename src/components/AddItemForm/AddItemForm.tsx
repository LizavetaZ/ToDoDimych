import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {ControlPoint} from "@mui/icons-material";

export type AddItemFormSubmitHelperType = {
    setError: (error: string) => void,
    setnewTaskTitle:(newTaskTitle: string) => void
}

type AddItemFormPropsType = {
    addItem: (title: string, helpers: AddItemFormSubmitHelperType) => void
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
    const addTask = async () => {
        if (newTaskTitle.trim() !== '') {
               addItem(newTaskTitle.trim(), {setError, setnewTaskTitle});
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
            <IconButton onClick={addTask} color = {"primary"} style = {{marginLeft: '5px'}} disabled={disabled}><ControlPoint/></IconButton>
        </div>
    )
})