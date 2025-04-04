"use client";
import React, { useState, useEffect } from "react";

const TradeSimulator = () => {
  const [initial, setInitial] = useState("");
  const [rate, setRate] = useState("");
  const [ret, setRet] = useState("");
  const [duration, setDuration] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const defaultValues = {
    initial: 333,
    rate: 0.01,
    ret: 0.88,
    duration: 365,
  };

  // Set default values if fields are empty on first render
  useEffect(() => {
    if (initial === "") setInitial(defaultValues.initial);
    if (rate === "") setRate(defaultValues.rate);
    if (ret === "") setRet(defaultValues.ret);
    if (duration === "") setDuration(defaultValues.duration);
  }, [
    initial,
    rate,
    ret,
    duration,
    defaultValues.initial,
    defaultValues.rate,
    defaultValues.ret,
    defaultValues.duration,
  ]);

  const handleSimulate = () => {
    const parsedInitial =
      initial === "" ? defaultValues.initial : parseFloat(initial);
    const parsedRate = rate === "" ? defaultValues.rate : parseFloat(rate);
    const parsedRet = ret === "" ? defaultValues.ret : parseFloat(ret);
    const parsedDuration =
      duration === "" ? defaultValues.duration : parseInt(duration);

    if (
      isNaN(parsedInitial) ||
      parsedInitial <= 0 ||
      isNaN(parsedRate) ||
      parsedRate <= 0 ||
      isNaN(parsedRet) ||
      parsedRet <= 0 ||
      isNaN(parsedDuration) ||
      parsedDuration <= 0
    ) {
      setError("Please enter valid positive numbers.");
      return;
    }

    setError("");
    const trades = [];
    let compound = parsedInitial;

    for (let day = 1; day <= parsedDuration; day++) {
      compound += compound * parsedRate * parsedRet;
      const trade1 = compound;

      compound += compound * parsedRate * parsedRet;
      const trade2 = compound;

      trades.push({ day, trade1, trade2 });
    }

    setResults(trades);
  };

  const InputField = ({ label, value, onChange, placeholder, note }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type="number"
        step="0.0001"
        placeholder={placeholder}
        className="p-3 bg-white text-black rounded shadow focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-gray-400">{note}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-16">
          📈 Trade Simulator
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left - Input Form */}
          <div className="lg:w-1/2 bg-white/5 p-6 rounded-xl shadow-md border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">
                  {"Initial Amount"}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 333"
                  className="p-3 bg-white text-black rounded shadow focus:outline-none"
                  value={initial}
                  onChange={(e) => setInitial(e.target.value)}
                />
                <p className="text-xs text-gray-400">{"Default: 333"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">{"Rate"}</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 0.01"
                  className="p-3 bg-white text-black rounded shadow focus:outline-none"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <p className="text-xs text-gray-400">{"Default: 0.01 (1%)"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">
                  {"Return (ret)"}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="e.g. 0.88"
                  className="p-3 bg-white text-black rounded shadow focus:outline-none"
                  value={ret}
                  onChange={(e) => setRet(e.target.value)}
                />
                <p className="text-xs text-gray-400">{"Default: 0.88"}</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-300">
                  {"Duration (days)"}
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g. 365"
                  className="p-3 bg-white text-black rounded shadow focus:outline-none"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <p className="text-xs text-gray-400">{"Default: 365 days"}</p>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Simulate 🚀
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>

          {/* Right - Results */}
          <div className="lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Trading Results</h2>
            {results.length > 0 ? (
              <div className="max-h-[70vh] overflow-y-auto space-y-2 pr-2">
                {results.map(({ day, trade1, trade2 }) => (
                  <div
                    key={day}
                    className="bg-white/5 rounded p-3 border border-white/10 shadow-sm"
                  >
                    <p className="text-sm">
                      <span className="text-blue-400 font-medium">
                        Day {day}
                      </span>{" "}
                      —
                      <span className="ml-2">
                        Trade 1: $
                        {parseFloat(trade1.toFixed(2)).toLocaleString()}
                      </span>{" "}
                      |
                      <span className="ml-2">
                        Trade 2: $
                        {parseFloat(trade2.toFixed(2)).toLocaleString()}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No trades simulated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeSimulator;
