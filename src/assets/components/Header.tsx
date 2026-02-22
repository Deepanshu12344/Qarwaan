import { Plane, Hotel } from 'lucide-react';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-lg transition">
            <Plane className="w-4 h-4" />
            <span className="text-sm font-medium">Find Flight</span>
          </button>
          <button className="flex items-center gap-2 cursor-pointer text-white px-4 py-2 rounded-lg transition">
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-medium">Find Stay</span>
          </button>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-white text-2xl font-bold tracking-wider">Qarwaan</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white text-sm font-medium hover:underline">
            Login
          </button>
          <button className="bg-white text-gray-900 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
            Sign up
          </button>
        </div>
      </nav>
    </header>
  );
}
