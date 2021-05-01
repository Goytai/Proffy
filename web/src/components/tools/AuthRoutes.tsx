import React, { useContext } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import Context from './Context'

const AuthRoutes: React.FC<RouteProps> = ({component, ...rest}) => {

    const {token} = useContext(Context)

    const Component = component as React.ComponentClass

    return (
        <Route {...rest}
            render={() => {
                if (token) {
                    return <Component />
                }

                return <Redirect to='/' />
            }}
        />
    )
}


export default AuthRoutes