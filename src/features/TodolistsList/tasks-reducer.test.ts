import {tasksReducer, TasksStateType} from "./tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolists-Api";
import {addTaskTC, fetchTasksTC, removeTaskTC, updateTaskTC} from "features/TodolistsList/task-actions";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "features/TodolistsList/todolists-actions";

let startState: TasksStateType = {}
beforeEach(() => {
    startState = {
        'toDoList1': [
            {
                id: '1',
                title: "CSS",
                status: TaskStatuses.New,
                completed: false,
                todoListId: 'toDoList1',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: "JS",
                status: TaskStatuses.Completed,
                completed: false,
                todoListId: 'toDoList1',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: "ReactJS",
                status: TaskStatuses.New,
                completed: false,
                todoListId: 'toDoList1',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            }],
        'toDoList2': [
            {
                id: '1',
                title: "bread",
                status: TaskStatuses.New,
                completed: false,
                todoListId: 'toDoList2',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: '2',
                title: "Milk",
                status: TaskStatuses.Completed,
                completed: false,
                todoListId: 'toDoList2',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: '3',
                title: "tea",
                status: TaskStatuses.New,
                completed: false,
                todoListId: 'toDoList2',
                addedDate: '',
                startDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    }
})

test('correct task should be deleted from correct array', () => {
    const param = {taskId: '2',todolistId: 'toDoList2'}
    const action = removeTaskTC.fulfilled(param, 'requestId', param)

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'].length).toBe(3)
    expect(endState['toDoList2'].length).toBe(2)
    expect(endState['toDoList2'].every(t => t.id !== '2')).toBeTruthy()
})

test('correct task should be added from correct array', () => {
    let task = {
        id: 'id exists',
        title: "juice",
        status: TaskStatuses.New,
        completed: false,
        todoListId: 'toDoList2',
        addedDate: '',
        startDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: TaskPriorities.Low
    };
    const action = addTaskTC.fulfilled(task, 'requestId', {title: task.title, todoListId: task.todoListId})

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'].length).toBe(3)
    expect(endState['toDoList2'].length).toBe(4)
    expect(endState['toDoList2'][0].title).toBe('juice')
    expect(endState['toDoList2'][0].id).toBeDefined()
    expect(endState['toDoList2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    let updateModel = {taskId: '2',domainModel: {status:TaskStatuses.New},todoListId: 'toDoList2'};
    const action = updateTaskTC.fulfilled(updateModel, 'requestId', updateModel)

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['toDoList2'][1].status).toBe(TaskStatuses.New)
})

test('title of specified task should be changed', () => {
    let updateModel = {taskId: '2',domainModel:  {title: 'MilkyWay'},todoListId: 'toDoList2'};
    const action = updateTaskTC.fulfilled(updateModel, 'requestId', updateModel)

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList2'][1].title).toBe('MilkyWay')
    expect(endState['toDoList1'][1].title).toBe("JS")
    expect(endState['toDoList2'][0].title).toBe("bread")
})

test('new property with new array should be added when new todolist is added', () => {
    let payload = {todolist:{
            id: 'todolistid3',
            title: "i'm new",
            addedDate: '',
            order: 0
        }};
    const action = addTodolistTC.fulfilled (payload, 'requestId', {title: payload.todolist.title})
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'toDoList1' && k != 'toDoList2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolistTC.fulfilled({id: 'toDoList2'}, 'requestId', {todolistId: 'toDoList2'})
    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['toDoList2']).not.toBeDefined()
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolistTC.fulfilled({id: 'toDoList2'}, 'requestId', {todolistId: 'toDoList2'})
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['toDoList2']).not.toBeDefined()
})

test('empty arrays should be added, when we set todolists', () => {
    const action = fetchTodolistsTC.fulfilled({todolists:[
        {id: '1', title: 'title 1', addedDate: '', order: 0},
        {id: '2', title: 'title 2', addedDate: '', order: 0}
    ]}, 'requestId')

    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toBeDefined()
    expect(endState['2']).toBeDefined()
})

test('tasks should be added for todolist', () => {
    const action = fetchTasksTC.fulfilled({tasks: startState['toDoList1'],todolistId: 'toDoList1'}, 'requestId', 'toDoList1')

    const endState = tasksReducer({
        'toDoList2': [],
        'toDoList1': []
    }, action)

    expect(endState['toDoList1'].length).toBe(3)
    expect(endState['toDoList2'].length).toBe(0)
})


