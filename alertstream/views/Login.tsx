import type { FC } from "hono/jsx";
import { useState } from 'hono/jsx';
import Layout from "../components/Layout.tsx";

const LoginView: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChanges = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.id === 'username') {
      setUsername(target.value);
    } else {
      setPassword(target.value);
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    console.log('username:', username);
    console.log('password:', password);

    // send the data to the server
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
  }

  return (
    <Layout title={'Login'}>
      <h1>Login Page</h1>
      <p>Login with your username and password.</p>

      <form action="/api/v1/auth/login" method="post">
        <label htmlFor="username" onChange={handleChanges} value={username}>Username</label>
        <input type="text" name="username" id="username" />

        <label htmlFor="password" onChange={handleChanges} value={password}>Password</label>
        <input type="password" name="password" id="password" />

        <button type="submit">Login</button>
      </form>
    </Layout>
  )
}

export default LoginView;