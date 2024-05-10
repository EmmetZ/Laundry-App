import { useLocation } from 'react-router-dom'

const ErrorPage = () => {
  const loc = useLocation()
  console.log(loc)
  return (
    <div>Error!!!!!!!!!</div>
  )
}

export default ErrorPage