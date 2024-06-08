import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const location = useLocation()
  const { pathname } = location

  const showSearchBar = ![
    '/register',
    '/sign-in',
    '/my-bookings',
    '/my-hotels',
    '/booking',
    '/add-hotel',
    '/edit-hotel'
  ].includes(pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      {showSearchBar && (
        <div className="container mx-auto">
          <SearchBar />
        </div>
      )}
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
