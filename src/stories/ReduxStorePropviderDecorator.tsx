import React from 'react';
import {Provider} from "react-redux";
import {AppRootState} from "../state/store";
import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "../state/todolists-reducer";
import {tasksReducer} from "../state/tasks-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../api/todolists-Api";

export const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0},
        {id: 'todolistId2', title: 'What to by', filter: 'all', addedDate: '', order: 0}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId1'
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId1'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId2'
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId2'
            }
        ],
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootState)


const ReduxStorePropviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
};

export default ReduxStorePropviderDecorator;