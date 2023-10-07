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
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useDispatch, useSelector} from "react-redux";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {AppRootState, useAppDispatch, useAppSelector} from "./store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {logoutTC} from "../features/TodolistsList/auth-reducer";


type PropsType = {
    demo?: boolean;
}

function App({demo = false}: PropsType) {

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootState, boolean>(state => state.app.isInitialized)
    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)
    const isLoggedIn1 = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!demo) {
            dispatch(initializeAppTC())
        }
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
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

