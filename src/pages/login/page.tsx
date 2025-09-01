import { useState } from 'react'
import { login } from '@/services/auth'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      //baru ditambahin dulu sementara
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/')
      toast.success('Login berhasil!')
    } catch {
      toast.error('Login gagal. Periksa email atau password.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
