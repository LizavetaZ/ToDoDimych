import {AddItemForm} from "./AddItemForm";
import {action} from '@storybook/addon-actions'

export default {
    title:'AddItemForm Component',
    component: AddItemForm
}

const someAsyncFunction =() => {
    setTimeout(() => {}, 1000)
}

const callback = async () => {
    // Perform asynchronous operations here
    await someAsyncFunction();
    // Rest of the callback logic
    action('Button add was pressed inside the form');
};

export const AddItemFormBaseExample = (props: any) => {
    return <AddItemForm addItem={callback}/>
}

export const AddItemFormDisabledExample = (props: any) => {
    return <AddItemForm disabled = {true} addItem={callback}/>
}