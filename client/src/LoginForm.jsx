import { useState } from 'react'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      const response = await fetch("http://localhost:3000/v1/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        const error = data.errors[0].msg
        console.log(`error: ${error}`)
        setError(error)
        return
      } 

      console.log(`token: ${data.token}`)
      setError('')
    } catch (error) {
      setError(error)
    }
  }

  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
    </div>
  );
}

export default LoginForm