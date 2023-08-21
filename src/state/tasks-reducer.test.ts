import {TasksStateType} from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-reducer";
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";

test ('correct task should be deleted from correct array', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = removeTaskAC('2', 'toDoList2')

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'].length).toBe(3)
    expect(endState['toDoList2'].length).toBe(2)
    expect(endState['toDoList2'].every(t => t.id!=='2')).toBeTruthy()
    expect(endState['toDoList2'][0].id).toBe('1')
    expect(endState['toDoList2'][1].id).toBe('3')
})

test ('correct task should be added from correct array', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = addTaskAC('juice', 'toDoList2')

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'].length).toBe(3)
    expect(endState['toDoList2'].length).toBe(4)
    expect(endState['toDoList2'][0].title).toBe('juice')
    expect(endState['toDoList2'][0].id).toBeDefined()
    expect(endState['toDoList2'][0].isDone).toBe(false)
})

test ('status of specified task should be changed', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = changeTaskStatusAC('2', false, 'toDoList2')

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList1'][1].isDone).toBeTruthy()
    expect(endState['toDoList2'][1].isDone).toBeFalsy()
})

test ('title of specified task should be changed', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = changeTaskTitleAC('2', 'MilkyWay', 'toDoList2')

    const endState = tasksReducer(startState, action)

    expect(endState['toDoList2'][1].title).toBe('MilkyWay')
    expect(endState['toDoList1'][1].title).toBe("JS")
})

test ('new property with new array should be added when new todolist is added', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = addTodolistAC('new todolist')
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k !='toDoList1' && k!= 'toDoList2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test ('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        'toDoList1': [
            {id: '1', title: "CSS", isDone: true},
            {id: '2', title: "JS", isDone: true},
            {id: '3', title: "ReactJS", isDone: false}],
        'toDoList2': [
            {id: '1', title: "bread", isDone: false},
            {id: '2', title: "Milk", isDone: true},
            {id: '3', title: "tea", isDone: false}
        ]
    }

    const action = removeTodolistAC('toDoList2')
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['toDoList2']).not.toBeDefined()
})

