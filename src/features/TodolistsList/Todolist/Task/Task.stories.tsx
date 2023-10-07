import {action} from '@storybook/addon-actions'
import {Task} from "./Task";
import ReduxStorePropviderDecorator from "../../../../stories/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../../../../api/todolists-Api";

export default {
    title: 'Task Component',
    component: Task,
    decorators: [ReduxStorePropviderDecorator]
}

export const TaskBaseExample = (props: any) => {

    const handleTaskStatusChange = (todolistId: string, taskId: string, isDone: boolean) => {
        action('Task Status Changed')({todolistId, taskId, isDone});
    };

    const onRemoveTaskHandler = (taskId: string, todolistId: string) => {
        action("Task was deleted")();
    };

    return (<>
            <Task todolistId='todolistId1' task={{
                id: '1', status: TaskStatuses.Completed, title: 'CSS', description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId1'
            }}/>
            <Task todolistId='todolistId2' task={{
                id: '2', status: TaskStatuses.New, title: 'JS', description: '', priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                completed: false,
                todoListId: 'todolistId2'
            }}/>
        </>
    );
}
