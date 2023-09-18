import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanPropsType = {
    title: string
    onChange: (newValue:string) => void
}

export const EditableSpan = React.memo ((props: EditableSpanPropsType) => {
    console.log('Span')
    const [editMode, seteditMode] = useState<boolean>(false)
    const [title, setTitle] = useState('')

    const activateEditMode = () => {
        seteditMode(true)
        setTitle(props.title)
    }
    const activateViewMode = () => {
        seteditMode(false)
        props.onChange(title)
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onChange={onChangeTitleHandler} onBlur={activateViewMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{props.title}</span>
 })