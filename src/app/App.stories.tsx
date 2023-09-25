import App from "../app/App";
import ReduxStorePropviderDecorator from "../stories/ReduxStorePropviderDecorator";

export default {
    title: 'App stories',
    component: App,
    decorators: [ReduxStorePropviderDecorator]
}


export const AppBaseExample = () => {
    return (

            <App demo={true}/>
    )
}