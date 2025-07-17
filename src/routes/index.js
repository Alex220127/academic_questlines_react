import authRoutes from './auth/authRoutes'
import homeRoutes from './home/homeRoutes'
import questlineRoutes from './questlines/questlineRoutes'
import storeRoutes from './store/storeRoutes'
import inventoryRoutes from './inventory/inventoryRoutes'

const allRoutes = [ ...authRoutes, ...homeRoutes, ...questlineRoutes, ...storeRoutes, ...inventoryRoutes ]

export default allRoutes
