import App from "../app/App";
import {BrowserDecorator, ReduxStoreProviderDecorator} from "../stories/ReduxStoreProviderDecorator";

export default {
    title: 'Application stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserDecorator]
}


export const AppBaseExample = () => {
    return (

            <App demo={true}/>
    )
}