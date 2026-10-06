import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatabaseBadge from '@/components/DatabaseBadge';
import { AuthProvider } from '@/lib/context/AuthContext';

export const metadata = {
  title: 'RentEase — Premium Tech & Equipment Rentals',
  description: 'Rent premium cameras, gaming consoles, travel gear, VR headsets, and 4K projectors without upfront ownership costs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F4] text-[#292824] antialiased selection:bg-[#F6E58D] selection:text-[#292824]">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <DatabaseBadge />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
