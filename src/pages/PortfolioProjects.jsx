import { Navigate, useParams } from 'react-router-dom'

/** Legacy route — redirects into main admin panel */
export default function PortfolioProjects() {
  const { portfolioId } = useParams()
  return <Navigate to={`/dashboard?portfolio=${portfolioId}`} replace />
}
