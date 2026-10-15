import React, { useState } from 'react';
import { ArrowLeftRight, ArrowRight, Landmark, ShieldCheck } from 'lucide-react';
import { RTC_LIST } from '../data/rtcData';
import { useBooking } from '../context/BookingContext';

const RTC_DISPLAY_ORDER = ['apsrtc', 'tsrtc', 'ksrtc', 'msrtc', 'gsrtc', 'upsrtc'];
const orderedRtcList = [...RTC_LIST].sort(
  (first, second) => RTC_DISPLAY_ORDER.indexOf(first.id) - RTC_DISPLAY_ORDER.indexOf(second.id)
);

export default function RtcSection() {
  const { handleSearch, searchParams } = useBooking();
  const [selectedRoutes, setSelectedRoutes] = useState(() =>
    Object.fromEntries(RTC_LIST.map(rtc => [rtc.id, rtc.route]))
  );

  const handleSearchRoute = route => {
    handleSearch(route.from, route.to, searchParams.date);
  };

  const handleSwapRoute = (rtc, event) => {
    event.stopPropagation();
    const currentRoute = selectedRoutes[rtc.id] || rtc.route;
    setSelectedRoutes(current => ({
      ...current,
      [rtc.id]: { from: currentRoute.to, to: currentRoute.from }
    }));
  };

  return (
    <section className="bg-[#eef7f6] py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Landmark className="h-4 w-4" />
              <span>Official Partners</span>
            </div>
            <h2 className="font-['Montserrat'] text-xl font-black tracking-tight text-gray-900 sm:text-3xl">
              GOVERNMENT BUSES (RTC)
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-gray-500">
              Book state transport buses with clear fares and no hidden charges
            </p>
          </div>
          <div className="flex max-w-full items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-auto">
            <ShieldCheck className="h-4 w-4" />
            <span>Govt Authorized Online Partner</span>
          </div>
        </div>

        <div className="space-y-5 sm:space-y-8">
          {orderedRtcList.map(rtc => {
            const activeRoute = selectedRoutes[rtc.id] || rtc.route;
            const routeDetails = rtc.routes?.find(route =>
              route.from === activeRoute.from && route.to === activeRoute.to
            );
            const startingFare = routeDetails?.fare ?? rtc.startingFare;
            const busCount = routeDetails?.busCount ?? rtc.busCount;

            return (
              <article
                key={rtc.id}
                className="group relative isolate overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-emerald-50/50 p-4 shadow-[0_8px_18px_rgba(17,24,39,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_36px_rgba(16,185,129,0.14)] sm:rounded-[28px] sm:p-6"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 -bottom-2 -z-10 h-6 rounded-b-[28px] bg-white shadow-[0_8px_12px_rgba(17,24,39,0.07)]" />

                <div className="mb-4 flex flex-wrap items-start gap-2 sm:mb-5">
                  {rtc.liveTracking && (
                    <span className="rounded-xl bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                      Live Tracking
                    </span>
                  )}
                  {rtc.offer && (
                    <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                      {rtc.offer}
                    </span>
                  )}
                  <span className="rounded-xl bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-gray-800 sm:px-3 sm:text-sm">
                    {rtc.concession}
                  </span>
                </div>

                <div className="flex min-w-0 flex-col gap-4 sm:gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                    <div
                      aria-hidden="true"
                      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-sky-50 text-[#087e8b] shadow-inner sm:h-[76px] sm:w-[76px]"
                    >
                      <span className="absolute inset-1 rounded-full border border-amber-200" />
                      <span className="flex flex-col items-center">
                        <Landmark className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
                        <span className="mt-0.5 max-w-[46px] truncate font-['Montserrat'] text-[9px] font-black tracking-tight sm:max-w-[62px] sm:text-xs">
                          {rtc.name}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold leading-tight text-gray-900 sm:text-2xl">{rtc.name} Buses</h3>
                      <p className="mt-1 break-words text-sm leading-relaxed text-gray-700 sm:text-xl">{rtc.fullName}</p>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4 xl:items-end">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                      <p className="text-left text-sm text-gray-600 sm:text-right sm:text-lg">
                        <span className="font-medium text-gray-900">{busCount} buses</span>
                        <span className="text-gray-500"> starting from </span>
                        <span className="font-bold text-gray-900">₹{startingFare}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSearchRoute(activeRoute)}
                        className="w-full shrink-0 rounded-full bg-gradient-to-r from-[#087e8b] to-[#102b32] px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-[#075e68] hover:to-[#071d25] hover:shadow-lg hover:shadow-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087e8b] focus-visible:ring-offset-2 sm:w-auto sm:px-9 sm:py-4 sm:text-lg"
                      >
                        Show buses
                      </button>
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2 border-t border-gray-100 pt-3 xl:justify-end xl:border-0 xl:pt-0">
                      <span className="w-full text-xs font-semibold text-gray-500 sm:w-auto">Choose route:</span>
                      {rtc.routes.map(route => {
                        const isSelected = route.from === activeRoute.from && route.to === activeRoute.to;
                        return (
                          <button
                            key={`${route.from}-${route.to}`}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedRoutes(current => ({ ...current, [rtc.id]: route }))}
                            className={`max-w-full rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold transition ${
                              isSelected
                                ? 'border-[#087e8b] bg-sky-50 text-[#075e68]'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-sky-200 hover:bg-sky-50'
                            }`}
                          >
                            <span className="break-words">{route.from}</span>
                            <ArrowRight className="mx-0.5 inline h-3 w-3 shrink-0" />
                            <span className="break-words">{route.to}</span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={event => handleSwapRoute(rtc, event)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#075e68] hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087e8b]"
                        aria-label={`Swap ${rtc.name} route direction`}
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5" />
                        Swap
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
