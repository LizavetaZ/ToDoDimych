import {action} from '@storybook/addon-actions'
import {Task} from "./Task";
import ReduxStorePropviderDecorator from "./stories/ReduxStorePropviderDecorator";

export default {
    title: 'Task Component',
    component: Task,
    decorators: [ReduxStorePropviderDecorator]
}

export const TaskBaseExample = (props: any) => {

    const handleTaskStatusChange = (todolistId: string, taskId: string, isDone: boolean) => {
        action('Task Status Changed')({todolistId, taskId, isDone});
    };

    const onRemoveTaskHandler = () => {
        action("Task was deleted")}

        return (<>
                <Task todolistId='todolistId1' task={{id: '1', isDone: true, title: 'CSS'}}/>
                <Task todolistId='todolistId2' task={{id: '2', isDone: false, title: 'JS'}}/>
            </>
        );
    }
