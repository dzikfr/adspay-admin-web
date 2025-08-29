import { useState } from 'react'
import { login } from '@/services/auth'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
      toast.success('Login berhasil!')
    } catch {
      toast.error('Login gagal. Periksa email atau password.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-6 shadow rounded bg-white space-y-4 w-80">
        <h1 className="text-xl font-bold">Login</h1>
        <Input
          className="w-full border p-2 rounded"
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          className="w-full border p-2 rounded"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </Button>
      </form>
    </div>
  )
}
