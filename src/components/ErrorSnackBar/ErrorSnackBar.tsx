import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useSelector} from "react-redux";
import {appActions} from "features/Application";
import {AppRootState} from "utils/types";
import {useActions} from "utils/redux-utils";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackBar() {
    // const [open, setOpen] = React.useState(true);

    const error = useSelector<AppRootState, string | null>(state => state.app.error)
    const {setAppError} = useActions(appActions)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAppError({error: null})

    };



    const isOpen = error !== null

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Stack>
    );
}