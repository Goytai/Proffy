import {createContext} from 'react'

const Context = createContext({
    token: '',
    setToken: (token: string) => {},
})

export default Context