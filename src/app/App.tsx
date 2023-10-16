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
import {Login, Menu} from "@mui/icons-material";
import {useSelector} from "react-redux";
import {initializeAppTC} from "./app-reducer";
import {useAppDispatch} from "./store";
import {Route, Routes} from "react-router-dom";
import {ErrorSnackBar} from "components/ErrorSnackBar/ErrorSnackBar";
import {logoutTC} from "features/Auth/auth-reducer";
import {TodolistsList} from "features/TodolistsList";
import {selectIsInitialized, selectStatus} from "app/selectors";
import {authSelectors} from "features/Auth";


type PropsType = {
    demo?: boolean;
}



function App({demo = false}: PropsType) {

    const dispatch = useAppDispatch()

    const status = useSelector(selectStatus)
    const isInitialized = useSelector(selectIsInitialized)
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn)

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

