import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { CartProvider } from '@/lib/cart';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Booking from '@/pages/Booking';
import FreeCheck from '@/pages/FreeCheck';
import Membership from '@/pages/Membership';
import BecomeMember from '@/pages/BecomeMember';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Maps from '@/pages/Maps';
import About from '@/pages/About';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Refunds from '@/pages/Refunds';
import Shipping from '@/pages/Shipping';
import Support from '@/pages/Support';
import FAQ from '@/pages/FAQ';
import Profile from '@/pages/Profile';
import ProfileGarden from '@/pages/ProfileGarden';
import ProfileEdit from '@/pages/ProfileEdit';
import ProfileSettings from '@/pages/ProfileSettings';
import ProfileSupport from '@/pages/ProfileSupport';
import ProfileActivity from '@/pages/ProfileActivity';
import ProfileGreenPoints from '@/pages/ProfileGreenPoints';
import ProfileMembership from '@/pages/ProfileMembership';
import Bookings from '@/pages/Bookings';
import BookingDetail from '@/pages/BookingDetail';
import BookingReview from '@/pages/BookingReview';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/book/:serviceId" element={<Booking />} />
              <Route path="/free-check" element={<FreeCheck />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/become-member" element={<BecomeMember />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refunds" element={<Refunds />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/support" element={<Support />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/garden" element={<Navigate to="/profile/garden" replace />} />
              <Route path="/plant-doctor" element={<Navigate to="/profile/garden" replace />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/garden" element={<ProfileGarden />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/profile/settings" element={<ProfileSettings />} />
              <Route path="/profile/support" element={<ProfileSupport />} />
              <Route path="/profile/activity" element={<ProfileActivity />} />
              <Route path="/profile/green-points" element={<ProfileGreenPoints />} />
              <Route path="/profile/membership" element={<ProfileMembership />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/bookings/:id" element={<BookingDetail />} />
              <Route path="/bookings/review" element={<BookingReview />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
