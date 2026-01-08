import React from 'react';
import {
  Input,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { useSignIn } from '../hooks/useSignIn';

export function SignInPage() {
  const {
    formData,
    loading,
    error,
    success,
    validationErrors,
    touched,
    handleInputChange,
    handleBlur,
    handleSubmit,
  } = useSignIn();

  return (
    <section className="m-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            {/* <img
              src="/Emails Vertical.svg"
              alt="Email System"
              className="h-56 w-auto"
            /> */}
          </div>
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" className="text-lg font-normal text-text-secondary">Enter your email and password to Sign In.</Typography>
        </div>

        {error && (
          <Alert color="red" className="mt-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" className="mt-4">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-md">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" className="-mb-3 font-medium text-text-secondary">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className={
                validationErrors.username && touched.username
                  ? '!border-error !border-t-error focus:!border-error'
                  : '!border-gray-200 focus:!border-primary'
              }
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="username"
              type="email"
              value={formData.username}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={validationErrors.username && touched.username}
            />
            {validationErrors.username && touched.username && (
              <Typography variant="small" className="-mt-2 mb-2 flex items-center gap-1 font-normal text-error">
                {validationErrors.username}
              </Typography>
            )}
            <Typography variant="small" className="-mb-3 font-medium text-text-secondary">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className={
                validationErrors.password && touched.password
                  ? '!border-error !border-t-error focus:!border-error'
                  : '!border-gray-200 focus:!border-primary'
              }
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={validationErrors.password && touched.password}
            />
            {validationErrors.password && touched.password && (
              <Typography variant="small" className="-mt-2 mb-2 flex items-center gap-1 font-normal text-error">
                {validationErrors.password}
              </Typography>
            )}
          </div>
          <Button type="submit" disabled={loading} className="mt-6" color="blue" fullWidth>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Typography variant="small" className="font-normal text-text-secondary">
            Don't have an account?{' '}
            <a href="/auth/register" className="font-medium text-primary hover:underline">
              Register here
            </a>
          </Typography>
        </div>
      </div>
    </section>
  );
}

export default SignInPage;

