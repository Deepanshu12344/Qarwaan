import { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ITINERARY_CATALOG,
  type ItineraryCatalogItem,
  type ItineraryCategory,
} from '../../data/itineraryCatalog';

type DayPlanItem = {
  id: string;
  catalogId: string;
  quantity: number;
};

type DayPlan = {
  id: string;
  title: string;
  items: DayPlanItem[];
};

type DragPayload =
  | { type: 'day'; dayId: string }
  | { type: 'item'; dayId: string; itemId: string };

function formatInr(value: number) {
  return `INR ${Math.round(value).toLocaleString()}`;
}

function getSeasonMultiplier(item: ItineraryCatalogItem, departureDate: string) {
  if (!departureDate) return 1;
  const month = new Date(departureDate).getMonth();
  if (Number.isNaN(month)) return 1;
  return item.seasonalMultipliers?.[month] || 1;
}

function getUnitPrice(item: ItineraryCatalogItem, adults: number, children: number, departureDate: string) {
  const seasonMultiplier = getSeasonMultiplier(item, departureDate);
  const day = departureDate ? new Date(departureDate).getDay() : -1;
  const isWeekend = day === 0 || day === 6;
  const weekendSurcharge = isWeekend ? item.weekendSurcharge || 0 : 0;

  if (item.pricingModel === 'per_booking') {
    return item.baseAdultPrice * seasonMultiplier + weekendSurcharge;
  }

  if (item.pricingModel === 'per_night_room') {
    const rooms = Math.max(1, Math.ceil((adults + children) / 2));
    return item.baseAdultPrice * rooms * seasonMultiplier + weekendSurcharge;
  }

  const childFactor = item.childPriceFactor ?? 1;
  const peopleTotal = adults * item.baseAdultPrice + children * item.baseAdultPrice * childFactor;
  return peopleTotal * seasonMultiplier + weekendSurcharge;
}

export default function ItineraryBuilderPage() {
  const [adultsInput, setAdultsInput] = useState('');
  const [childrenInput, setChildrenInput] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [days, setDays] = useState<DayPlan[]>([
    { id: 'day-1', title: 'Day 1', items: [] },
    { id: 'day-2', title: 'Day 2', items: [] },
  ]);
  const [selectedDayId, setSelectedDayId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItineraryCategory | ''>('');
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [dragging, setDragging] = useState<DragPayload | null>(null);

  const adults = useMemo(() => Math.max(1, Number(adultsInput) || 1), [adultsInput]);
  const children = useMemo(() => Math.max(0, Number(childrenInput) || 0), [childrenInput]);
  const quantity = useMemo(() => Math.max(1, Number(quantityInput) || 1), [quantityInput]);

  const filteredCatalog = useMemo(
    () => ITINERARY_CATALOG.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  );

  const catalogMap = useMemo(
    () => Object.fromEntries(ITINERARY_CATALOG.map((item) => [item.id, item])),
    []
  );

  const calculatedDays = useMemo(() => {
    return days.map((day) => {
      const computedItems = day.items
        .map((item) => {
          const catalog = catalogMap[item.catalogId];
          if (!catalog) return null;
          const unitPrice = getUnitPrice(catalog, adults, children, departureDate);
          const totalPrice = unitPrice * item.quantity;
          return { ...item, catalog, unitPrice, totalPrice };
        })
        .filter(Boolean) as Array<{
        id: string;
        quantity: number;
        catalog: ItineraryCatalogItem;
        unitPrice: number;
        totalPrice: number;
      }>;

      const dayTotal = computedItems.reduce((sum, item) => sum + item.totalPrice, 0);
      return { ...day, computedItems, dayTotal };
    });
  }, [days, adults, children, departureDate, catalogMap]);

  const subtotal = useMemo(
    () => calculatedDays.reduce((sum, day) => sum + day.dayTotal, 0),
    [calculatedDays]
  );
  const serviceFee = useMemo(() => subtotal * 0.03, [subtotal]);
  const tax = useMemo(() => (subtotal + serviceFee) * 0.05, [subtotal, serviceFee]);
  const grandTotal = useMemo(() => subtotal + serviceFee + tax, [subtotal, serviceFee, tax]);

  const addDay = () => {
    const next = days.length + 1;
    const id = `day-${Date.now()}`;
    const title = `Day ${next}`;
    setDays((prev) => [...prev, { id, title, items: [] }]);
    setSelectedDayId(id);
  };

  const removeDay = (dayId: string) => {
    if (days.length <= 1) return;
    setDays((prev) => prev.filter((day) => day.id !== dayId));
    if (selectedDayId === dayId) {
      setSelectedDayId(days.find((day) => day.id !== dayId)?.id || '');
    }
  };

  const moveDay = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= days.length) return;
    setDays((prev) => {
      const clone = [...prev];
      [clone[index], clone[nextIndex]] = [clone[nextIndex], clone[index]];
      return clone.map((day, idx) => ({ ...day, title: `Day ${idx + 1}` }));
    });
  };

  const moveDayById = (sourceDayId: string, targetDayId: string) => {
    if (!sourceDayId || !targetDayId || sourceDayId === targetDayId) return;
    setDays((prev) => {
      const sourceIndex = prev.findIndex((day) => day.id === sourceDayId);
      const targetIndex = prev.findIndex((day) => day.id === targetDayId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;

      const clone = [...prev];
      const [moved] = clone.splice(sourceIndex, 1);
      clone.splice(targetIndex, 0, moved);
      return clone.map((day, idx) => ({ ...day, title: `Day ${idx + 1}` }));
    });
  };

  const addCatalogItemToDay = () => {
    if (!selectedDayId || !selectedCategory || !selectedCatalogId || quantity <= 0) return;
    setDays((prev) =>
      prev.map((day) =>
        day.id === selectedDayId
          ? {
              ...day,
              items: [
                ...day.items,
                { id: `itm-${Date.now()}`, catalogId: selectedCatalogId, quantity: Math.max(1, quantity) },
              ],
            }
          : day
      )
    );
  };

  const removeCatalogItem = (dayId: string, itemId: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId ? { ...day, items: day.items.filter((item) => item.id !== itemId) } : day
      )
    );
  };

  const moveItemToDay = (sourceDayId: string, itemId: string, targetDayId: string) => {
    if (!sourceDayId || !itemId || !targetDayId) return;
    setDays((prev) => {
      const sourceDay = prev.find((day) => day.id === sourceDayId);
      if (!sourceDay) return prev;

      const item = sourceDay.items.find((entry) => entry.id === itemId);
      if (!item) return prev;

      return prev.map((day) => {
        if (day.id === sourceDayId) {
          return { ...day, items: day.items.filter((entry) => entry.id !== itemId) };
        }
        if (day.id === targetDayId) {
          return { ...day, items: [...day.items, { ...item, id: `itm-${Date.now()}` }] };
        }
        return day;
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#f4faf8]">
      <div className="relative overflow-hidden bg-[#112211] pb-16">
        <Header />
        <div className="container mx-auto px-5 pt-36 text-white md:px-8">
          <h1 className="text-4xl font-extrabold">Dynamic Itinerary Builder</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Real-time pricing from predefined travel components. No manual cost entry.
          </p>
        </div>
      </div>

      <main className="container mx-auto grid grid-cols-1 gap-6 px-5 py-10 md:px-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-2xl font-bold text-[#112211]">Planner Inputs</h2>
          <p className="mt-1 text-xs text-gray-500">
            Drag day cards to reorder. Drag components between days to rebalance the itinerary.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              placeholder="Departure date"
              className="rounded-lg border px-3 py-2"
            />
            <input
              type="number"
              min={1}
              value={adultsInput}
              onChange={(e) => setAdultsInput(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Adults (e.g. 2)"
            />
            <input
              type="number"
              min={0}
              value={childrenInput}
              onChange={(e) => setChildrenInput(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Children (e.g. 1)"
            />
          </div>

          <h3 className="mt-6 text-xl font-bold text-[#112211]">Add Components</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
            <select
              value={selectedDayId}
              onChange={(e) => setSelectedDayId(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Select day</option>
              {days.map((day) => (
                <option key={day.id} value={day.id}>
                  {day.title}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => {
                const category = e.target.value as ItineraryCategory | '';
                setSelectedCategory(category);
                setSelectedCatalogId('');
              }}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Select category</option>
              <option value="activity">Activity</option>
              <option value="hotel">Hotel</option>
              <option value="transfer">Transfer</option>
              <option value="addon">Addon</option>
            </select>

            <select
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Select component</option>
              {filteredCatalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                placeholder="Qty"
                className="w-20 rounded-lg border px-3 py-2"
              />
              <button
                onClick={addCatalogItemToDay}
                className="rounded-lg bg-[#112211] px-3 py-2 text-xs font-semibold text-white"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={addDay} className="rounded-lg border border-[#112211] px-3 py-2 text-xs font-semibold text-[#112211]">
              Add Day
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {calculatedDays.map((day, index) => (
              <article
                key={day.id}
                draggable
                onDragStart={() => setDragging({ type: 'day', dayId: day.id })}
                onDragEnd={() => setDragging(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!dragging) return;
                  if (dragging.type === 'day') {
                    moveDayById(dragging.dayId, day.id);
                  } else {
                    moveItemToDay(dragging.dayId, dragging.itemId, day.id);
                  }
                  setDragging(null);
                }}
                className="rounded-lg border p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[#112211]">{day.title}</p>
                    <p className="text-sm text-gray-600">{formatInr(day.dayTotal)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => moveDay(index, -1)} className="rounded border px-2 py-1 text-xs">Up</button>
                    <button onClick={() => moveDay(index, 1)} className="rounded border px-2 py-1 text-xs">Down</button>
                    <button onClick={() => removeDay(day.id)} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete Day</button>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {day.computedItems.length === 0 ? (
                    <p className="text-xs text-gray-500">No components added yet.</p>
                  ) : (
                    day.computedItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDragging({ type: 'item', dayId: day.id, itemId: item.id })}
                        onDragEnd={() => setDragging(null)}
                        className="flex flex-wrap items-center justify-between rounded border bg-[#fbfdfc] p-2 text-sm"
                      >
                        <div>
                          <p className="font-medium text-[#112211]">{item.catalog.title}</p>
                          <p className="text-xs text-gray-600">
                            Qty {item.quantity} x {formatInr(item.unitPrice)} ({item.catalog.pricingModel})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#112211]">{formatInr(item.totalPrice)}</p>
                          <button
                            onClick={() => removeCatalogItem(day.id, item.id)}
                            className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#112211]">Live Pricing</h3>
          <p className="mt-3 text-sm text-gray-600">Adults: {adults} | Children: {children}</p>
          <p className="text-sm text-gray-600">Departure: {departureDate || 'Not selected'}</p>
          <div className="mt-5 space-y-2 text-sm">
            <p className="flex justify-between"><span>Base subtotal</span><span>{formatInr(subtotal)}</span></p>
            <p className="flex justify-between"><span>Service fee (3%)</span><span>{formatInr(serviceFee)}</span></p>
            <p className="flex justify-between"><span>Taxes (5%)</span><span>{formatInr(tax)}</span></p>
            <p className="flex justify-between border-t pt-2 text-lg font-bold text-[#112211]">
              <span>Estimated total</span>
              <span>{formatInr(grandTotal)}</span>
            </p>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Estimate depends on seasonal multipliers, room occupancy, and weekend surcharges.
          </p>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
