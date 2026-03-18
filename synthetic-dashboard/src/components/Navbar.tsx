import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-[#0072B7] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="bg-white text-[#0072B7] p-1 rounded-sm text-xs font-black">2026</span>
              SEA Displacement Model
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            <Link href="/" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            <Link href="/map" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Interactive Map</Link>
            <Link href="/demographics" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Demographics</Link>
            <Link href="/allocator" className="text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-black transition-colors flex items-center gap-1">Simulator <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span></Link>
            <Link href="/methodology" className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">Methodology</Link>
            <Link href="/download" className="bg-white text-[#0072B7] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-bold transition-colors">Download Data</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
