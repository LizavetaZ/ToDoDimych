import * as appSelectors from 'features/Application/selectors'
import {slice, asyncActions} from 'features/Application/application-reducer'

const appReducer = slice.reducer
const actions = slice.actions

const appActions = {
    ...actions,
    ...asyncActions
}


export {
    appSelectors,
    appReducer,
    appActions
}