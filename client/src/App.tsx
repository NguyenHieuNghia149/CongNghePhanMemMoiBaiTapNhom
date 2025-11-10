import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import './App.css'

import router from './routes'
import { initializeSession } from './stores/slices/authSlice'
import { AppDispatch } from './stores/stores'

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(initializeSession())
  }, [dispatch])

  return <RouterProvider router={router} />
}

export default App
