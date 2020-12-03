import LocalCredentialStorage from 'local-credential-storage'
import { useEffect, useMemo, useReducer } from 'react'

const listeners: Set<() => void> = new Set()
function notifyListeners(): void {
  listeners.forEach(fn => fn())
}

function useForceUpdate(): () => void {
  const [, dispatchNoOp] = useReducer(() => ({}), {})
  return dispatchNoOp as () => void
}

export interface CredentialStorageInterface {
  setCredentials(username?: string, password?: string): void
  clearCredentials(): void
  credentialsAreSet: boolean
  username?: string
  password?: string
}

export function useLocalCredentialStorage({
  namespace,
}: {
  namespace?: string
} = {}): CredentialStorageInterface {
  // When credentials change, we need every instance of this hook to reload so
  // the components depending on it are rerendered. A common emitter notifies
  // each instance of the hook, and when each hook receives the signal, it
  // invokes `forceUpdate()`.
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    listeners.add(forceUpdate)
    return () => {
      listeners.delete(forceUpdate)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const storage = useMemo(() => new LocalCredentialStorage(namespace), [
    namespace,
  ])

  return {
    setCredentials(username?: string, password?: string): void {
      storage.set(username, password)
      notifyListeners()
    },
    clearCredentials(): void {
      storage.clear()
      notifyListeners()
    },
    credentialsAreSet: storage.isSet,
    ...storage.get(),
  }
}
