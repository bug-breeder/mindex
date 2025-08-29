import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '@/api/auth'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import AppLayout from '@/layouts/AppLayout'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const signInMutation = useSignIn()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await signInMutation.mutateAsync({ email, password })
      navigate('/maps')
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md p-8 border border-outline rounded-lg bg-surface">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-on-surface/70">Sign in to your Mindex account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="bordered"
            />
            
            <Input
              label="Password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="bordered"
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  type="button"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? '🙈' : '👁️'}
                </Button>
              }
            />

            {signInMutation.error && (
              <p className="text-red-500 text-sm">
                {signInMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              isLoading={signInMutation.isPending}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface/70">
              Don't have an account?{' '}
              <Link 
                to="/auth/signup" 
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}