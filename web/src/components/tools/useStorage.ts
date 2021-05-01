import { useCallback, useState } from 'react'
import storage from './Storage'

export default function useStorage(key: string) {
    const [state, setState] = useState(() => storage.get && storage.get(key))

    const set = useCallback(newValue => {
        storage.set && storage.set(key, newValue)
        setState(newValue)
    }, [key])

    const remove = useCallback(() => {
        storage.remove && storage.remove(key)
        setState(undefined)
    }, [key])

    return [state, set, remove]
}