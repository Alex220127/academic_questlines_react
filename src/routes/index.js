import authRoutes from './auth/authRoutes'
import homeRoutes from './home/homeRoutes'

const allRoutes = [ ...authRoutes, ...homeRoutes ]

export default allRoutes
