import {InitialStateType, slice} from "features/Application/application-reducer";
import {} from "features/Application";

const {reducer: appReducer} = slice
const {setAppStatus, setAppError} = slice.actions

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle',
        isInitialized: false
    }
})


test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppError({error: 'some error'}))

    expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatus({status: 'loading'}))

    expect(endState.status).toBe('loading')
})
