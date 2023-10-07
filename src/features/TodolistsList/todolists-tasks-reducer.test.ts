import {addTodolistAC, ToDoListDomainType, todolistsReducer} from "./todolists-reducer";
import {tasksReducer, TasksStateType} from "./tasks-reducer";

test('ids should be equals', () => {
    const startTasksState : TasksStateType = {}
    const startTodolistsState : Array<ToDoListDomainType> = []
    const newTodo: ToDoListDomainType = {
        id: 'todolistid3',
        title: "i'm new",
        addedDate: '',
        order: 0,
        filter: 'all',
        entityStatus: 'idle'
    }

    const action = addTodolistAC({todolist: newTodo})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)


})


