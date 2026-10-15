import React from 'react';
import { ArrowRight, Check, ChevronRight, MapPin, X } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

function PointCard({ title, subtitle, points, selectedPoint, onSelect, type, date }) {
  const isBoarding = type === 'boarding';

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-bold text-gray-900">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
      </header>
      <div className="divide-y divide-gray-100">
        {points.map((point, index) => {
          const selected = selectedPoint?.name === point.name;
          const pointDate = !isBoarding && date
            ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : null;

          return (
            <label
              key={`${point.name}-${index}`}
              className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition hover:bg-gray-50 ${
                selected ? 'bg-sky-50/50' : ''
              }`}
            >
              <span className="w-12 shrink-0 text-sm font-semibold text-gray-900">
                {point.time}
                {pointDate && <span className="mt-0.5 block text-[11px] font-normal text-[#087e8b]">{pointDate}</span>}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block break-words font-bold text-gray-900">{point.name}</span>
                <span className="mt-0.5 block break-words text-sm text-gray-500">{point.landmark}</span>
              </span>
              <input
                type="radio"
                name={`${type}-point`}
                checked={selected}
                onChange={() => onSelect(point)}
                aria-label={`Select ${title.toLowerCase()} point ${point.name}`}
                className="h-5 w-5 accent-[#087e8b]"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}

export default function BoardingPointsModal() {
  const {
    boardingPointsModalOpen,
    setBoardingPointsModalOpen,
    activeBookingData,
    selectedBoarding,
    setSelectedBoarding,
    selectedDropping,
    setSelectedDropping,
    continueToPassengerInfo
  } = useBooking();

  if (!boardingPointsModalOpen || !activeBookingData) return null;

  const { bus, fromCity, toCity, date, seats } = activeBookingData;
  const boardingPoint = selectedBoarding || bus.boardingPoints[0];
  const droppingPoint = selectedDropping || bus.droppingPoints[0];

  return (
    <div className="fixed inset-0 z-[55] overflow-y-auto bg-[#eef7f6]">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Return to seat selection"
              onClick={() => setBoardingPointsModalOpen(false)}
              className="rounded-full p-1.5 text-gray-700 transition hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="truncate font-semibold text-gray-900">
              {fromCity} <ChevronRight className="mx-1 inline h-4 w-4 text-gray-400" /> {toCity}
              <span className="ml-2 text-sm font-normal text-gray-500">· {bus.name}</span>
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-pink-100 px-3 py-1.5 text-center text-xs font-semibold text-pink-800">
            <span className="block">Women deal</span>
            <span>₹100 OFF</span>
          </div>
        </div>

        <nav aria-label="Booking progress" className="border-t border-gray-100">
          <ol className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-3 text-sm sm:gap-8">
            <li className="flex shrink-0 items-center gap-1.5 text-gray-500 sm:gap-2">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="sm:hidden">Seats</span>
              <span className="hidden sm:inline">Seats ({seats.length})</span>
            </li>
            <li aria-current="step" className="flex shrink-0 items-center gap-1.5 border-b-2 border-[#087e8b] pb-3 -mb-[14px] font-semibold text-[#087e8b] sm:gap-2">
              <MapPin className="h-4 w-4" />
              <span className="sm:hidden">Points</span>
              <span className="hidden sm:inline">Board/Drop point</span>
            </li>
            <li className="shrink-0 text-gray-400">
              <span className="sm:hidden">Passenger</span>
              <span className="hidden sm:inline">Passenger info</span>
            </li>
          </ol>
        </nav>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <PointCard
            title="Boarding points"
            subtitle={`Select boarding point · ${boardingPoint?.time || ''}`}
            points={bus.boardingPoints}
            selectedPoint={boardingPoint}
            onSelect={setSelectedBoarding}
            type="boarding"
            date={date}
          />
          <PointCard
            title="Dropping points"
            subtitle={`Select dropping point · ${droppingPoint?.time || ''}`}
            points={bus.droppingPoints}
            selectedPoint={droppingPoint}
            onSelect={setSelectedDropping}
            type="dropping"
            date={date}
          />
        </div>

        <div className="sticky bottom-0 mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{seats.length} seat{seats.length === 1 ? '' : 's'} selected</span>
            <span className="mx-2 text-gray-300">·</span>
            <span>{boardingPoint.name} to {droppingPoint.name}</span>
          </div>
          <button
            type="button"
            onClick={continueToPassengerInfo}
            disabled={!boardingPoint || !droppingPoint}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087e8b] px-6 py-3 font-bold text-white transition hover:bg-[#075e68] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Passenger information
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
