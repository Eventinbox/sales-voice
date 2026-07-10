"use client";

import { useState } from "react";
import { Message, DebtData, SaleData } from "../app/types";

interface DashboardProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
}

export default function Dashboard({ open, onClose, messages }: DashboardProps) {
  const [priceQuery, setPriceQuery] = useState("");

  const totalSales = messages
    .filter((m) => m.type === "sale" && m.data)
    .reduce((sum, m) => sum + (m.data as SaleData).amount, 0);

  const debts = messages.filter(
    (m) => m.type === "debt" && m.data,
  ) as (Message & {
    data: DebtData;
  })[];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-stone-900/30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel: bottom sheet on mobile, right slide-over on desktop */}
      <aside
        className={`fixed z-40 bg-stone-50 shadow-xl transition-transform duration-300
          inset-x-0 bottom-0 rounded-t-2xl max-h-[75vh] overflow-y-auto
          md:inset-y-0 md:right-0 md:left-auto md:w-96 md:max-h-none md:rounded-t-none md:rounded-l-2xl
          ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"}
        `}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-bold text-stone-800">Dashboard</h2>
          <button
            onClick={onClose}
            aria-label="Close dashboard"
            className="rounded-full p-2 text-stone-500 hover:bg-stone-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 px-5 py-4">
          {/* Total sales */}
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Today's sales
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-800">
              ₦{totalSales.toLocaleString()}
            </p>
          </div>

          {/* Outstanding debts */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
              Outstanding debts
            </p>
            <ul className="space-y-2">
              {debts.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-lg border-l-4 border-rose-500 bg-rose-50 px-3 py-2 text-sm"
                >
                  <span className="text-stone-700">{m.data.person}</span>
                  <span className="font-medium text-rose-800">
                    ₦{m.data.amount.toLocaleString()}
                  </span>
                </li>
              ))}
              {debts.length === 0 && (
                <li className="text-sm text-stone-400">No debts logged yet.</li>
              )}
            </ul>
          </div>

          {/* Price search */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-500">
              Check a price
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={priceQuery}
                onChange={(e) => setPriceQuery(e.target.value)}
                placeholder="e.g. rice"
                className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button className="shrink-0 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600">
                Search
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
