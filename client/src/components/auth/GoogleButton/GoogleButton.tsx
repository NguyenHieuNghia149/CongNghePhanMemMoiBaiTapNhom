import React, { useEffect, useRef } from 'react'
import { googleAuthService } from '../../../services/auth/googleAuth.service'
import './GoogleButton.css'

interface GoogleButtonProps {
  onSuccess: (credential: string) => void
  onError?: (error: Error) => void
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  width?: number
  logo_alignment?: 'left' | 'center'
  disabled?: boolean
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onSuccess,
  onError,
  text = 'continue_with',
  theme = 'filled_blue',
  size = 'large',
  width,
  logo_alignment = 'left',
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!buttonRef.current || disabled) return

    googleAuthService.initGoogleAuth()

    const timer = setTimeout(() => {
      if (buttonRef.current && window.google) {
        googleAuthService.renderGoogleButton(
          buttonRef.current,
          onSuccess,
          onError || ((err: Error) => console.error(err))
        )

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme,
          size,
          text,
          width: width || buttonRef.current.offsetWidth,
          logo_alignment,
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [onSuccess, onError, text, theme, size, width, logo_alignment, disabled])

  if (disabled) {
    return (
      <button className="google-button-custom google-button-custom--disabled" disabled>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>
    )
  }

  return (
    <div className="google-button-container">
      <div ref={buttonRef} className="google-button-wrapper" />
    </div>
  )
}

export default GoogleButton


