import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Successful from './Pages/Successful'
import Recover from './Pages/Recover'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Teach from './Pages/Teach'
import Learn from './Pages/Learn'

import AuthRoutes from './components/tools/AuthRoutes'
import Road from './components/tools/Road'

function Routes () {
    return (
        <BrowserRouter>
            <Road path='/' exact component={Login} />
            <Road path='/register' component={Register} />
            <Road path='/recover' component={Recover} />

            <Route path='/successful' component={Successful} />
            
            <AuthRoutes path='/home' component={Home} />
            <AuthRoutes path='/profile' component={Profile} />
            <AuthRoutes path='/teach' component={Teach} />
            <AuthRoutes path='/learn' component={Learn} />

        </BrowserRouter>
    )
}

export default Routes