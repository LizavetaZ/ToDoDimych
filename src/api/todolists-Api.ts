import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "3b4322e8-b3c7-4878-93d0-70679b2f5b17"
    }
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

//api
export const todolistsApi = {
    getToDoLists() {
        return instance.get<ToDoListType[]>('todo-lists')
    },
    createToDoList(title: string) {
        return instance.post<ResponseType<{ item: ToDoListType }>>('todo-lists', {title: title})
    },
    updateToDoList(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    deleteToDoList(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType<{ userId?: number }>>('auth/login')
    },
    me() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>('auth/me')
    }

}

//types
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type ToDoListType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type FieldErrorType = {field: string, error: string}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    fieldsErrors?: Array<FieldErrorType>
    data: D
}

type GetTasksResponseType = {
    error: string | null
    totalCount: number
    items: TaskType[],
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type UpdateTaskModelType = {
    title: string
    description: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}