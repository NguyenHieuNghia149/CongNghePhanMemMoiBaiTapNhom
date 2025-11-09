import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService, ApiError } from '../../../services/auth/auth.service'
import './Register.css'

interface FieldErrors {
  firstname?: string
  lastname?: string
  email?: string
  password?: string
  confirmPassword?: string
  otp?: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  
  // Form state
  const [showPassword, setShowPassword] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  // Error state
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpLoading, setIsOtpLoading] = useState(false)
  
  // OTP state
  const [otpCooldown, setOtpCooldown] = useState(0)
  const [otpSent, setOtpSent] = useState(false)

  const canSendOtp = useMemo(
    () => email.trim().length > 0 && otpCooldown === 0 && !isOtpLoading,
    [email, otpCooldown, isOtpLoading]
  )

  // Cleanup timer on unmount - using ref to avoid stale closure
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Clear timer on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const togglePassword = () => setShowPassword(!showPassword)

  /**
   * Validate single field
   */
  const validateField = useCallback(
    (field: keyof FieldErrors) => {
      const nextError: Partial<FieldErrors> = {}
      
      switch (field) {
        case 'firstname':
          if (!firstname.trim()) {
            nextError.firstname = 'First name is required'
          } else if (firstname.trim().length < 2) {
            nextError.firstname = 'First name must be at least 2 characters'
          }
          break
          
        case 'lastname':
          if (!lastname.trim()) {
            nextError.lastname = 'Last name is required'
          } else if (lastname.trim().length < 2) {
            nextError.lastname = 'Last name must be at least 2 characters'
          }
          break
          
        case 'email':
          if (!email.trim()) {
            nextError.email = 'Email is required'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextError.email = 'Email is not valid'
          }
          break
          
        case 'password':
          if (!password) {
            nextError.password = 'Password is required'
          } else if (password.length < 6) {
            nextError.password = 'Password must be at least 6 characters'
          } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            nextError.password = 'Password must contain uppercase, lowercase, and number'
          }
          break
          
        case 'confirmPassword':
          if (!confirmPassword) {
            nextError.confirmPassword = 'Please confirm your password'
          } else if (password !== confirmPassword) {
            nextError.confirmPassword = 'Passwords do not match'
          }
          break
          
        case 'otp':
          if (!otp.trim()) {
            nextError.otp = 'OTP is required'
          } else if (!/^\d{4,8}$/.test(otp)) {
            nextError.otp = 'OTP must be 4-8 digits'
          }
          break
      }
      
      setFieldErrors(prev => ({ ...prev, ...nextError }))
      return Object.keys(nextError).length === 0
    },
    [firstname, lastname, email, password, confirmPassword, otp]
  )

  /**
   * Validate all fields before submit
   */
  const validateAll = useCallback((): boolean => {
    const nextErrors: FieldErrors = {}

    if (!firstname.trim()) {
      nextErrors.firstname = 'First name is required'
    } else if (firstname.trim().length < 2) {
      nextErrors.firstname = 'First name must be at least 2 characters'
    }

    if (!lastname.trim()) {
      nextErrors.lastname = 'Last name is required'
    } else if (lastname.trim().length < 2) {
      nextErrors.lastname = 'Last name must be at least 2 characters'
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Email is not valid'
    }

    if (!password) {
      nextErrors.password = 'Password is required'
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    if (!otp.trim()) {
      nextErrors.otp = 'OTP is required'
    } else if (!/^\d{4,8}$/.test(otp)) {
      nextErrors.otp = 'OTP must be 4-8 digits'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [firstname, lastname, email, password, confirmPassword, otp])

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    // Clear previous field errors
    setFieldErrors({})

    // Validate all fields
    if (!validateAll()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.register({
        email: email.trim(),
        password,
        passwordConfirm: confirmPassword.trim(),
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        otp: otp.trim(),
      })

      // Success
      if (response) {
        // Show success message (optional)
        // toast.success('Registration successful! Please login.')
        
        // Navigate to login
        navigate('/login', {
          state: {
            message: 'Registration successful! Please login with your credentials.',
            email: email.trim(),
          },
        })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Display general error message
        setError(err.message)

        // Display field-specific errors if available
        if (err.hasFieldErrors()) {
          const newFieldErrors: FieldErrors = {}
          
          err.fieldErrors?.forEach(({ field, message }) => {
            // Map backend field names to frontend field names
            const fieldMap: Record<string, keyof FieldErrors> = {
              firstName: 'firstname',
              lastName: 'lastname',
              email: 'email',
              password: 'password',
              confirmPassword: 'confirmPassword',
              verifyEmailCode: 'otp',
            }
            
            const frontendField = fieldMap[field] || field as keyof FieldErrors
            newFieldErrors[frontendField] = message
          })
          
          setFieldErrors(newFieldErrors)
        }

        // Special handling for specific error codes
        if (err.code === 'CONFLICT') {
          // Email already exists - highlight email field
          setFieldErrors(prev => ({
            ...prev,
            email: 'This email is already registered',
          }))
        } else if (err.code === 'UNAUTHORIZED') {
          // Invalid OTP - highlight OTP field
          setFieldErrors(prev => ({
            ...prev,
            otp: 'OTP is invalid or expired. Please request a new one.',
          }))
          setOtp('') // Clear OTP field
        }
      } else {
        // Unknown error
        setError('An unexpected error occurred. Please try again.')
        console.error('Registration error:', err)
      }

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle OTP request
   */
  const handleSendOtp = useCallback(async () => {
    // Clear previous errors
    setError('')
    setFieldErrors(prev => ({ ...prev, otp: undefined }))

    // Validate email
    if (!email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is required' }))
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is not valid' }))
      return
    }

    setIsOtpLoading(true)

    try {
      await authService.requestRegisterOtp(email.trim())
      
      // Success - clear OTP field and start cooldown
      setOtp('')
      setOtpSent(true)
      setOtpCooldown(60)

      // Countdown timer
      const timer = setInterval(() => {
        setOtpCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Show success feedback (optional)
      // toast.success('OTP sent to your email!')
    } catch (err) {
      if (err instanceof ApiError) {
        // Display error based on code
        if (err.code === 'CONFLICT') {
          setFieldErrors(prev => ({
            ...prev,
            email: 'This email is already registered',
          }))
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to send OTP. Please try again.')
        console.error('OTP request error:', err)
      }
    } finally {
      setIsOtpLoading(false)
    }
  }, [email])

  /**
   * Clear field error when user starts typing
   */
  const clearFieldError = useCallback((field: keyof FieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    // Also clear general error if user is fixing issues
    if (error) {
      setError('')
    }
  }, [error])

  return (
    <div className="reg-page">
      <div className="reg-page__background">
        <div className="reg-page__blob reg-page__blob--one" />
        <div className="reg-page__blob reg-page__blob--two" />
        <div className="reg-page__grid" />
      </div>

      <div className="reg-container">
        <div className="reg-card">
          <div className="reg-card__left">
            <div className="reg-hero">
              <div className="reg-hero__content">
                <div className="reg-hero__badge">Code & Learn</div>
                <h1 className="reg-hero__title">Create your account</h1>
                <p className="reg-hero__desc">
                  Join challenges, track progress, and sharpen your skills.
                </p>
              </div>
              <div className="reg-hero__image-wrapper">
                {/* <img className="reg-hero__image" src={heroImg} alt="Coding" /> */}
              </div>
            </div>
          </div>

          <div className="reg-card__right">
            <div className="reg-form-wrapper">
              <div className="reg-form__header">
                <h2>Sign up</h2>
                <p>Start your coding journey today</p>
              </div>

              {/* Global error message */}
              {error && (
                <div className="reg-form__error" role="alert">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form className="reg-form" onSubmit={handleSubmit} noValidate>
                {/* First name & Last name */}
                <div className="form-row two-cols">
                  <div className="form-field">
                    <label htmlFor="firstname">
                      First name <span className="required">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="firstname"
                        type="text"
                        placeholder="Jane"
                        value={firstname}
                        onChange={e => {
                          setFirstname(e.target.value)
                          clearFieldError('firstname')
                        }}
                        onBlur={() => validateField('firstname')}
                        aria-invalid={!!fieldErrors.firstname}
                        aria-describedby={
                          fieldErrors.firstname ? 'firstname-error' : undefined
                        }
                        className={fieldErrors.firstname ? 'input-error' : ''}
                        disabled={isLoading}
                      />
                    </div>
                    {fieldErrors.firstname && (
                      <div
                        id="firstname-error"
                        className="form-field__error"
                        role="alert"
                      >
                        {fieldErrors.firstname}
                      </div>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="lastname">
                      Last name <span className="required">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        id="lastname"
                        type="text"
                        placeholder="Doe"
                        value={lastname}
                        onChange={e => {
                          setLastname(e.target.value)
                          clearFieldError('lastname')
                        }}
                        onBlur={() => validateField('lastname')}
                        aria-invalid={!!fieldErrors.lastname}
                        aria-describedby={
                          fieldErrors.lastname ? 'lastname-error' : undefined
                        }
                        className={fieldErrors.lastname ? 'input-error' : ''}
                        disabled={isLoading}
                      />
                    </div>
                    {fieldErrors.lastname && (
                      <div
                        id="lastname-error"
                        className="form-field__error"
                        role="alert"
                      >
                        {fieldErrors.lastname}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="form-field">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        clearFieldError('email')
                        // Reset OTP sent status if email changes
                        if (otpSent) setOtpSent(false)
                      }}
                      onBlur={() => validateField('email')}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={
                        fieldErrors.email ? 'email-error' : undefined
                      }
                      className={fieldErrors.email ? 'input-error' : ''}
                      disabled={isLoading}
                    />
                  </div>
                  {fieldErrors.email && (
                    <div
                      id="email-error"
                      className="form-field__error"
                      role="alert"
                    >
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                {/* OTP */}
                <div className="form-field">
                  <label htmlFor="otp">
                    OTP <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter OTP code"
                      value={otp}
                      onChange={e => {
                        const v = e.target.value.replace(/[^0-9]/g, '')
                        setOtp(v)
                        clearFieldError('otp')
                      }}
                      onBlur={() => validateField('otp')}
                      aria-invalid={!!fieldErrors.otp}
                      aria-describedby={fieldErrors.otp ? 'otp-error' : undefined}
                      className={fieldErrors.otp ? 'input-error' : ''}
                      disabled={isLoading}
                      maxLength={8}
                    />
                    <button
                      type="button"
                      className="otp-button"
                      onClick={handleSendOtp}
                      disabled={!canSendOtp}
                      aria-label={otpCooldown > 0 ? `Resend OTP in ${otpCooldown} seconds` : 'Send OTP'}
                    >
                      {isOtpLoading ? (
                        <span className="spinner-small" />
                      ) : otpCooldown > 0 ? (
                        `Resend (${otpCooldown}s)`
                      ) : otpSent ? (
                        'Resend OTP'
                      ) : (
                        'Get OTP'
                      )}
                    </button>
                  </div>
                  {fieldErrors.otp && (
                    <div id="otp-error" className="form-field__error" role="alert">
                      {fieldErrors.otp}
                    </div>
                  )}
                  {otpSent && !fieldErrors.otp && (
                    <div className="form-field__success">
                      OTP sent to {email}. Please check your inbox.
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="form-field">
                  <label htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value)
                        clearFieldError('password')
                      }}
                      onBlur={() => validateField('password')}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={
                        fieldErrors.password ? 'password-error' : undefined
                      }
                      className={fieldErrors.password ? 'input-error' : ''}
                      disabled={isLoading}
                    />
                     <button
                      type="button"
                      className="input-group__toggle"
                      onClick={togglePassword}
                      aria-label="Toggle password visibility"
                      tabIndex={-1}
                    >
                      {showPassword ? 'Hide' : 'Show'} 
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div
                      id="password-error"
                      className="form-field__error"
                      role="alert"
                    >
                      {fieldErrors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-field">
                  <label htmlFor="confirmPassword">
                    Confirm password <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value)
                        clearFieldError('confirmPassword')
                      }}
                      onBlur={() => validateField('confirmPassword')}
                      aria-invalid={!!fieldErrors.confirmPassword}
                      aria-describedby={
                        fieldErrors.confirmPassword
                          ? 'confirmPassword-error'
                          : undefined
                      }
                      className={fieldErrors.confirmPassword ? 'input-error' : ''}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {fieldErrors.confirmPassword && (
                    <div
                      id="confirmPassword-error"
                      className="form-field__error"
                      role="alert"
                    >
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    'Create account'
                  )}
                </button>

                {/* Footer */}
                <div className="form-footer">
                  Already have an account?{' '}
                  <Link className="link" to="/login">
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register