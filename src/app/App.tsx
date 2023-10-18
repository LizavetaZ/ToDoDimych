import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {asyncActions} from "features/Application/application-reducer";
import {Route, Routes} from "react-router-dom";
import {ErrorSnackBar} from "components/ErrorSnackBar/ErrorSnackBar";
import {authActions} from "features/Auth";
import {TodolistsList} from "features/TodolistsList";
import {selectIsInitialized, selectStatus} from "features/Application/selectors";
import {authSelectors, Login} from "features/Auth";
import {useActions, useAppDispatch} from "utils/redux-utils";
import {appActions} from "features/Application";


type PropsType = {
    demo?: boolean;
}



function App({demo = false}: PropsType) {


    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

    const {logout} = useActions(authActions)
    const {initializeApp} = useActions(appActions)

    useEffect(() => {
        if (!demo) {
            initializeApp()
        }
    }, [])

    const logoutHandler = useCallback(() => {
        logout()
    }, [])

    if(!isInitialized) {
        return <div style={{position:'fixed', top: "30%", width:'100%', textAlign:'center'}}> <CircularProgress /></div>
    }


    return (
            <div className="App">
                <ErrorSnackBar/>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton edge={"start"} color={"inherit"} aria-label={'menu'}>
                            <Menu/>
                        </IconButton>
                        <Typography variant={"h6"}>
                            News
                        </Typography>
                        {isLoggedIn && <Button color={"inherit"} onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path="/" element={<TodolistsList demo={demo}/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Container>
            </div>
    );
}


export default App;

