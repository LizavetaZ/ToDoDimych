import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, LinearProgress, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./app-reducer";
import {AppRootState} from "./store";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";


type PropsType = {
    demo?: boolean;
}

function App({demo = false}: PropsType) {

    const status = useSelector<AppRootState, RequestStatusType>(state => state.app.status)

    return (
        <BrowserRouter>
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
                        <Button color={"inherit"}>Login</Button>
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
        </BrowserRouter>
    );
}


export default App;

