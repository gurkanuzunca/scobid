import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { getUser } from '../services/auth';


export default function AuthRequired({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) =>
                getUser() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};
