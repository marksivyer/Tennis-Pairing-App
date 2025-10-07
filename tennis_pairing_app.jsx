import React, { useState } from "react";

export default function TennisPairingApp() {
  const [playersText, setPlayersText] = useState("");
  const [courtsText, setCourtsText] = useState("");
  const [mode, setMode] = useState("doubles");
  const [result, setResult] = useState(null);

  const parseList = (text) => text.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pairPlayers(players, mode) {
    const shuffled = shuffle(players);
    if (mode === 'singles') {
      return shuffled.reduce((acc, _, i) => {
        if (i % 2 === 0) acc.push({ a: shuffled[i], b: shuffled[i + 1] || null });
        return acc;
      }, []);
    }
    const teams = [];
    for (let i = 0; i < shuffled.length; i += 2)
      teams.push([shuffled[i], shuffled[i + 1]].filter(Boolean));
    return teams.reduce((acc, _, i) => {
      if (i % 2 === 0) acc.push({ a: teams[i], b: teams[i + 1] || null });
      return acc;
    }, []);
  }

  function allocate(matches, courts) {
    const allocation = courts.map((court, i) => ({ court, match: matches[i] || null }));
    const waiting = matches.slice(courts.length);
    return { allocation, waiting };
  }

  function generate() {
    const players = parseList(playersText);
    const courts = parseList(courtsText);
    if (!players.length || !courts.length) return alert('Enter players and courts');
    const matches = pairPlayers(players, mode);
    const { allocation, waiting } = allocate(matches, courts);
    setResult({ allocation, waiting });
  }

  function displayMatch(m) {
    if (!m) return '(empty)';
    if (Array.isArray(m.a)) {
      return m.b ? `${m.a.join(' & ')} vs ${m.b.join(' & ')}` : `${m.a.join(' & ')} (BYE)`;
    }
    return m.b ? `${m.a} vs ${m.b}` : `${m.a} (BYE)`;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🎾 Tennis Pairing & Court Allocator</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div>
            <label className="font-semibold block mb-2">Players</label>
            <textarea className="w-full border p-3 rounded h-44" placeholder="Alice\nBob\nCharlie" value={playersText} onChange={e => setPlayersText(e.target.value)} />
          </div>

          <div>
            <label className="font-semibold block mb-2">Courts</label>
            <textarea className="w-full border p-3 rounded h-32" placeholder="Court 1\nCourt 2" value={courtsText} onChange={e => setCourtsText(e.target.value)} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button onClick={() => setMode('singles')} className={`flex-1 px-4 py-2 rounded ${mode==='singles'?'bg-blue-600 text-white':'border'}`}>Singles</button>
              <button onClick={() => setMode('doubles')} className={`flex-1 px-4 py-2 rounded ${mode==='doubles'?'bg-blue-600 text-white':'border'}`}>Doubles</button>
            </div>
            <button onClick={generate} className="px-4 py-2 bg-green-600 text-white rounded w-full">Generate</button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold mb-2">Results</h2>
          {!result && <p className="text-gray-600">No schedule yet. Enter data and click Generate.</p>}
          {result && (
            <>
              <ul className="space-y-2">
                {result.allocation.map((a, i) => (
                  <li key={i} className="border p-3 rounded bg-gray-50">
                    <b>{a.court}:</b> {displayMatch(a.match)}
                  </li>
                ))}
              </ul>

              {result.waiting.length>0 && (
                <div>
                  <h3 className="font-semibold mb-2">Waiting</h3>
                  <ul className="space-y-2">
                    {result.waiting.map((m,i)=>(<li key={i} className="border p-3 rounded bg-gray-50">{displayMatch(m)}</li>))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
