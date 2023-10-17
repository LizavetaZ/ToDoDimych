import {AddItemForm} from "./AddItemForm";
import {action} from '@storybook/addon-actions'

export default {
    title:'AddItemForm Component',
    component: AddItemForm
}

const callback = async (...params: any[]) => {
    action('Button add was pressed inside the form')(...params)
};

export const AddItemFormBaseExample = (props: any) => {
    return <AddItemForm addItem={callback}/>
}

export const AddItemFormDisabledExample = (props: any) => {
    return <AddItemForm disabled = {true} addItem={callback}/>
}