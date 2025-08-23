import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">🏠 Home Page</h1>
      <p className="text-muted-foreground mt-2">
        Ini halaman utama
        <Link to="/about">
          <Button>Go to About</Button>
        </Link>
      </p>
    </div>
  )
}
