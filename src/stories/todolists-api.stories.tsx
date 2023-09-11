import {useEffect, useState} from "react";
import axios from "axios";
import {todolistsApi} from "../api/todolists-Api";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "3b4322e8-b3c7-4878-93d0-70679b2f5b17"
    }
}

export const GetToDolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.getToDoLists()
            .then((res) => {
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateToDolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')

    const createToDoList = () => {
        todolistsApi.createToDoList(title)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
    <div>
        <input placeholder={'todolistTitle'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}/>
        <button onClick={createToDoList}>Create ToDoList</button>
    </div></div>
}

export const UpdateToDolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const updateToDoList = () => {
        todolistsApi.updateToDoList(todolistId, title)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
            <input placeholder={'todoListTitle'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}/>
            <button onClick={updateToDoList}>Update ToDoList</button>
        </div>
    </div>
}

export const DeleteToDolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteToDoList = () => {
        todolistsApi.deleteToDoList(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
            <button onClick={deleteToDoList}>Delete ToDoList</button>
        </div>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTasks = () => {
        todolistsApi.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
    <div>
        <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
        <button onClick={getTasks}>Get tasks</button>
    </div>
    </div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    const [taskId, setTaskId] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')


    const deleteTask = () => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
    <div>
        <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
        <input placeholder={'taskId'} value={taskId} onChange={(e) => {setTaskId(e.currentTarget.value)}}/>
        <button onClick={deleteTask}>Delete task</button>
    </div></div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const createTask = () => {
        todolistsApi.createTask(todolistId, title)
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
            <input placeholder={'taskTitle'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}/>
            <button onClick={createTask}>Create task</button>
        </div>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [description, setDescription] = useState<string>('description 1')
    const [completed, setCompleted] = useState<boolean>(false)
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')

    const updateTask = () => {
        todolistsApi.updateTask(todolistId, taskId,{
            deadline: '',
            description: description,
            priority: priority,
            startDate: '',
            status: status,
            title: title,
            completed: completed
        } )
            .then((res) => {
                setState(res.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
            <input placeholder={'taskId'} value={taskId} onChange={(e) => {setTaskId(e.currentTarget.value)}}/>
                <input placeholder={'taskTitle'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}/>
            <input placeholder={'description'} value={description} onChange={(e) => {setDescription(e.currentTarget.value)}}/>
            <input placeholder={'status'} value={status} onChange={(e) => {setStatus(Number(e.currentTarget.value))}}/>
            <input placeholder={'priority'} value={priority} onChange={(e) => {setPriority(Number(e.currentTarget.value))}}/>
            <button onClick={updateTask}>Update task</button>
        </div>
    </div>
}