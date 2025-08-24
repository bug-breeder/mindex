import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignUp } from '@/api/auth'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import DefaultLayout from '@/layouts/default'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const signUpMutation = useSignUp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return
    }

    try {
      await signUpMutation.mutateAsync({ email, password })
      // Show success message or redirect to email verification
      navigate('/auth/login', { 
        state: { message: 'Account created! Please check your email to verify your account.' }
      })
    } catch (error) {
      console.error('Sign up failed:', error)
    }
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md p-8 border border-outline rounded-lg bg-surface">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Create account</h1>
            <p className="text-on-surface/70">Get started with Mindex today</p>
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
                <button
                  className="focus:outline-none text-on-surface/50 hover:text-on-surface"
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? '🙈' : '👁️'}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isRequired
              variant="bordered"
              isInvalid={confirmPassword !== '' && password !== confirmPassword}
              errorMessage={
                confirmPassword !== '' && password !== confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
              endContent={
                <button
                  className="focus:outline-none text-on-surface/50 hover:text-on-surface"
                  type="button"
                  onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? '🙈' : '👁️'}
                </button>
              }
            />

            {signUpMutation.error && (
              <p className="text-red-500 text-sm">
                {signUpMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              isLoading={signUpMutation.isPending}
              isDisabled={password !== confirmPassword}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface/70">
              Already have an account?{' '}
              <Link 
                to="/auth/login" 
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}