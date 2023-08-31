import {action} from "@storybook/addon-actions";
import AppWithRedux from "./AppWithRedux";
import {Provider} from "react-redux";
import {store} from "./state/store";
import ReduxStorePropviderDecorator from "./stories/ReduxStorePropviderDecorator";

export default {
    title: 'App with Redux',
    component: AppWithRedux,
    decorators: [ReduxStorePropviderDecorator]
}


export const AppWithReduxBaseExample = () => {
    return (

            <AppWithRedux/>
    )
}