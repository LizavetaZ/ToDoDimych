import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "3b4322e8-b3c7-4878-93d0-70679b2f5b17"
    }
}

const instance = axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

export type ToDoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
}

type GetTasksResponseType = {
    error: string | null
    totalCount: number
    items:TaskType[],
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}


type UpdateTaskModelType = {
    title: string
    description?: string
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

export const todolistsApi = {
    getToDoLists() {
        return instance.get<ToDoListType[]>('todo-lists')
    },
    createToDoList(title: string) {
        return instance.post<ResponseType<{item: ToDoListType}>>('todo-lists', {title: title})
    },
    updateToDoList(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    deleteToDoList(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    getTasks(todolistId: string) {
        return  instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return  instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    updateTask(todolistId: string, taskId: string, title: string, model:UpdateTaskModelType){
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}