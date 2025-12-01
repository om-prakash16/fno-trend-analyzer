import Link from "next/link";
import { BarChart2, Star } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-500 hover:text-blue-400 transition-colors">
                        <BarChart2 className="w-6 h-6" />
                        <span className="hidden sm:inline">NSE Analyzer</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">NIFTY 50</Link>
                        <Link href="/nifty100" className="hover:text-white transition-colors">NIFTY 100</Link>
                        <Link href="/movers/gainers" className="text-green-400 hover:text-green-300 transition-colors">Gainers</Link>
                        <Link href="/movers/losers" className="text-red-400 hover:text-red-300 transition-colors">Losers</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/watchlist" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="hidden sm:inline">Watchlist</span>
                    </Link>
                    {/* Mobile Menu Placeholder - For now just wrapping links if needed or keeping simple */}
                </div>
            </div>
            {/* Mobile Navigation Bar (Bottom or separate) - For now, let's just ensure links are accessible on desktop. 
                For true mobile responsiveness, we'd need a hamburger menu. 
                Let's add a simple horizontal scroll for mobile links below header if needed, or just rely on desktop for now as requested "responsive".
                Actually, let's make the main links visible on mobile via a simple overflow-x-auto strip if we have time.
                For now, the user asked for "responsive", so hiding them on mobile (hidden md:flex) is bad.
            */}
            <div className="md:hidden flex items-center gap-4 px-4 py-2 overflow-x-auto border-t border-gray-800 text-sm font-medium text-gray-400 no-scrollbar">
                <Link href="/" className="whitespace-nowrap hover:text-white">NIFTY 50</Link>
                <Link href="/nifty100" className="whitespace-nowrap hover:text-white">NIFTY 100</Link>
                <Link href="/movers/gainers" className="whitespace-nowrap text-green-400 hover:text-green-300">Gainers</Link>
                <Link href="/movers/losers" className="whitespace-nowrap text-red-400 hover:text-red-300">Losers</Link>
            </div>
        </nav>
    );
}
