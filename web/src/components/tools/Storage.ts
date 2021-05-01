import Cookie from 'js-cookie'

interface Storage {
    set?: Function,
    get?: Function,
    remove?: Function
}

const storage: Storage = {}

try {
    if(!window.localStorage) {
        throw Error('No local storage')
    }

    storage.set = (key: string, value: JSON) => localStorage.setItem(key, JSON.stringify(value))
    storage.get = (key: string) => {
        const item = localStorage.getItem(key) as string
        try {
            return JSON.parse(item)
        } catch (e) {
            return null
        }
    }
    storage.remove = (key: string) => localStorage.removeItem(key)
} catch (e) {
    storage.set = Cookie.set
    storage.get = Cookie.get
    storage.remove = Cookie.remove
}

export default storage