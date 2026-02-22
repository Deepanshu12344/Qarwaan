import { Plane, Hotel, ArrowLeftRight, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

export default function SearchForm() {
  const [activeTab, setActiveTab] = useState<'flights' | 'stays'>('flights');

  return (
    <div className="container mx-auto px-4 -mt-20 relative z-20">
      <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(141,211,187,0.2)] p-8 max-w-5xl mx-auto">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('flights')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'flights'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Plane className="w-4 h-4" />
            Flights
          </button>
          <button
            onClick={() => setActiveTab('stays')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'stays'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Hotel className="w-4 h-4" />
            Stays
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">From - To</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="Lahore - Karachi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <ArrowLeftRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Trip</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white">
              <option>Return</option>
              <option>One Way</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Depart - Return</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="07 Nov 22 - 13 Nov 22"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Passenger - Class</label>
            <div className="relative">
              <input
                type="text"
                defaultValue="1 Passenger, Economy"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-6">
          <button className="text-gray-700 text-sm font-medium hover:text-gray-900">
            + Add Promo Code
          </button>
          <button className="bg-[#8DD3BB] hover:bg-[#8DD3BB] text-black px-8 py-3 rounded-lg font-medium transition flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Show Flights
          </button>
        </div>
      </div>
    </div>
  );
}
