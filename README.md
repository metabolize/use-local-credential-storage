# use-local-credential-storage

React hook for storing and retrieving login credentials for a web app using
[window.localStorage][localStorage]. Works well with Create React App /
Gatsby / JAMstack.

[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## Usage

```js
// Setting this to something unique to your app avoids pulling credentials for
// the wrong app, even if both apps occasionally run on e.g. localhost:3000.
const AUTH_NAMESPACE = 'com.yourcompany.yourapp';
```

### Example login page

```js
export function AuthPage(): JSX.Element {
  const {
    username: storedUsername,
    password: storedPassword,
    setCredentials,
    clearCredentials,
    credentialsAreSet,
  } = useLocalCredentialStorage({ namespace: AUTH_NAMESPACE });
  const [username, setUsername] = useState(() => storedUsername || '');
  const [password, setPassword] = useState(() => storedPassword || '');

  function handleSave(): void {
    setCredentials(username, password);
  }

  function handleClear(): void {
    clearCredentials();
    setUsername('');
    setPassword('');
  }

  return (
    <main>
      {credentialsAreSet ? (
        <p>Credentials are set</p>
      ) : (
        <p>Credentials are not set</p>
      )}
      <form onSubmit={event => event.preventDefault()}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          type="string"
          autoComplete="off"
          value={username}
          onChange={({ target: { value } }) => setUsername(value)}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <button onClick={handleSave}>Save</button>
        <p>
          {credentialsAreSet ? (
            <button onClick={handleClear}>Clear Credentials</button>
          ) : null}
        </p>
      </form>
    </main>
  );
}
```

## Example component using credentials

```js
export function ExamplePage(): JSX.Element {
  const { credentialsAreSet, username, password } = useLocalCredentialStorage({
    namespace: AUTH_NAMESPACE,
  });

  if (!credentialsAreSet) {
    return <div>Not logged in!</div>
  }

  // Do something with `username` and `password`.
  return ...
}
```

`useLocalCredentialStorage()` has a notification method built in. Whenever
the credentials are set or cleared, any mounted component which invokes
`useLocalCredentialStorage()` will re-render.

## License

This project is licensed under the 2-clause BSD license.
