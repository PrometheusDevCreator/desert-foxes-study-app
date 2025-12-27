'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MapLocation {
  id: string;
  name: string;
  type: 'city' | 'battlefield' | 'port' | 'route';
  coordinates: { lat: number; lng: number };
  description: string;
}

const locations: MapLocation[] = [
  {
    id: 'el-alamein',
    name: 'El Alamein',
    type: 'battlefield',
    coordinates: { lat: 30.8333, lng: 28.9500 },
    description: 'Site of the decisive battles in October-November 1942. The narrow gap between the Mediterranean and the Qattara Depression made it an ideal defensive position.',
  },
  {
    id: 'tobruk',
    name: 'Tobruk',
    type: 'port',
    coordinates: { lat: 32.0833, lng: 23.9500 },
    description: 'Vital port that changed hands multiple times. The Australian-led garrison held out for 241 days in 1941, becoming known as the Rats of Tobruk.',
  },
  {
    id: 'tripoli',
    name: 'Tripoli',
    type: 'city',
    coordinates: { lat: 32.8872, lng: 13.1913 },
    description: 'Capital of Italian Libya and main Axis supply port. Rommel arrived here in February 1941 and it fell to the Eighth Army in January 1943.',
  },
  {
    id: 'benghazi',
    name: 'Benghazi',
    type: 'port',
    coordinates: { lat: 32.1167, lng: 20.0667 },
    description: 'Key supply port in Cyrenaica that changed hands five times during the campaign as the front line surged back and forth.',
  },
  {
    id: 'gazala',
    name: 'Gazala Line',
    type: 'battlefield',
    coordinates: { lat: 32.1500, lng: 23.5500 },
    description: 'Site of the Battle of Gazala in May-June 1942, where Rommel outmaneuvered the British defensive line in one of his greatest victories.',
  },
  {
    id: 'kasserine',
    name: 'Kasserine Pass',
    type: 'battlefield',
    coordinates: { lat: 35.1667, lng: 8.8333 },
    description: 'Mountain pass in Tunisia where Rommel defeated inexperienced American forces in February 1943.',
  },
  {
    id: 'bir-hakeim',
    name: 'Bir Hakeim',
    type: 'battlefield',
    coordinates: { lat: 30.9833, lng: 23.5833 },
    description: 'Desert fortress heroically defended by Free French forces for 16 days in June 1942, buying crucial time for the British.',
  },
  {
    id: 'sidi-rezegh',
    name: 'Sidi Rezegh',
    type: 'battlefield',
    coordinates: { lat: 31.7000, lng: 23.8000 },
    description: 'Site of fierce tank battles during Operation Crusader in November 1941, including the bloody Totensonntag engagement.',
  },
];

// Timeline phases for the animated campaign map
const timelinePhases = [
  {
    id: 'phase-0',
    time: 'Sep 1940',
    title: 'Italian Invasion',
    description: 'Italian forces under Graziani invade Egypt from Libya, advancing 60 miles to Sidi Barrani before halting.',
    alliedPositions: [
      { name: 'Western Desert Force', x: 85, y: 45, type: 'defense' },
    ],
    axisPositions: [
      { name: 'Italian Tenth Army', x: 55, y: 45 },
    ],
  },
  {
    id: 'phase-1',
    time: 'Dec 1940 - Feb 1941',
    title: 'Operation Compass',
    description: 'British offensive destroys the Italian Tenth Army, capturing 130,000 prisoners. The Allies advance to El Agheila.',
    alliedPositions: [
      { name: 'Western Desert Force', x: 25, y: 42, type: 'advance' },
      { name: 'Tobruk (captured)', x: 45, y: 40, type: 'objective' },
    ],
    axisPositions: [
      { name: 'Italian remnants', x: 15, y: 50 },
    ],
  },
  {
    id: 'phase-2',
    time: 'Feb - Apr 1941',
    title: 'Rommel Arrives',
    description: 'Rommel launches a surprise offensive, pushing the weakened British back to the Egyptian border. Tobruk is besieged.',
    alliedPositions: [
      { name: 'Tobruk (besieged)', x: 45, y: 40, type: 'defense' },
      { name: 'Eighth Army', x: 75, y: 48, type: 'defense' },
    ],
    axisPositions: [
      { name: 'Afrika Korps', x: 55, y: 45 },
      { name: '15th Panzer', x: 65, y: 50 },
    ],
  },
  {
    id: 'phase-3',
    time: 'Nov - Dec 1941',
    title: 'Operation Crusader',
    description: 'British offensive relieves Tobruk after 241 days. Rommel is pushed back to El Agheila.',
    alliedPositions: [
      { name: 'Eighth Army', x: 45, y: 42, type: 'advance' },
      { name: 'Tobruk (relieved)', x: 45, y: 40, type: 'objective' },
    ],
    axisPositions: [
      { name: 'Afrika Korps', x: 25, y: 48 },
    ],
  },
  {
    id: 'phase-4',
    time: 'May - Jun 1942',
    title: 'Gazala & Fall of Tobruk',
    description: 'Rommel outflanks the Gazala Line and captures Tobruk in a single day. The Eighth Army retreats to El Alamein.',
    alliedPositions: [
      { name: 'Eighth Army', x: 88, y: 45, type: 'defense' },
    ],
    axisPositions: [
      { name: 'Afrika Korps', x: 75, y: 48 },
      { name: 'Tobruk (captured)', x: 45, y: 40 },
    ],
  },
  {
    id: 'phase-5',
    time: 'Oct - Nov 1942',
    title: 'El Alamein',
    description: 'Montgomery defeats Rommel at El Alamein. The Afrika Korps begins its final retreat westward.',
    alliedPositions: [
      { name: 'Eighth Army', x: 70, y: 42, type: 'advance' },
    ],
    axisPositions: [
      { name: 'Afrika Korps (retreating)', x: 45, y: 48 },
    ],
  },
  {
    id: 'phase-6',
    time: 'Nov 1942 - May 1943',
    title: 'Torch & Tunisia',
    description: 'Allies land in French North Africa. Axis forces trapped between two armies surrender in May 1943.',
    alliedPositions: [
      { name: 'Eighth Army', x: 25, y: 45, type: 'advance' },
      { name: 'First Army (Torch)', x: 15, y: 30, type: 'advance' },
    ],
    axisPositions: [
      { name: 'Axis (Tunisia)', x: 20, y: 38 },
    ],
  },
];

export default function MapsPage() {
  const [activeTab, setActiveTab] = useState<'animated' | 'locations'>('animated');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showAllied, setShowAllied] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play animation
  const playAnimation = () => {
    setIsPlaying(true);
    let phase = 0;
    const interval = setInterval(() => {
      phase++;
      if (phase >= timelinePhases.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setCurrentPhase(phase);
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Map Room</h1>
          <p className="text-[var(--foreground-muted)]">
            Explore the North African Campaign through animated battle progressions and key locations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab('animated')}
            className={`px-6 py-3 font-bold transition-all border-b-2 ${
              activeTab === 'animated'
                ? 'border-[var(--accent-sand)] text-[var(--accent-sand)]'
                : 'border-transparent hover:text-[var(--accent-sand)]'
            }`}
          >
            Campaign Timeline
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`px-6 py-3 font-bold transition-all border-b-2 ${
              activeTab === 'locations'
                ? 'border-[var(--accent-sand)] text-[var(--accent-sand)]'
                : 'border-transparent hover:text-[var(--accent-sand)]'
            }`}
          >
            Key Locations
          </button>
        </div>

        {/* Animated Timeline View */}
        {activeTab === 'animated' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">North African Campaign: 1940-1943</h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAllied}
                      onChange={(e) => setShowAllied(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Allied Forces
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAxis}
                      onChange={(e) => setShowAxis(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                      Axis Forces
                    </span>
                  </label>
                </div>
              </div>

              {/* Schematic Map Display */}
              <div className="relative aspect-[16/9] bg-gradient-to-b from-blue-900/30 via-[var(--accent-sand)]/20 to-[var(--accent-rust)]/20 rounded-lg overflow-hidden mb-4">
                {/* Mediterranean Sea label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-blue-400/50 text-sm font-medium">
                  Mediterranean Sea
                </div>

                {/* Coastline */}
                <div className="absolute top-[35%] left-0 right-0 h-1 bg-[var(--accent-sand)]/30"></div>

                {/* Country labels */}
                <div className="absolute top-[25%] left-[5%] text-xs text-[var(--foreground-muted)]">Tunisia</div>
                <div className="absolute top-[25%] left-[25%] text-xs text-[var(--foreground-muted)]">Libya</div>
                <div className="absolute top-[25%] right-[10%] text-xs text-[var(--foreground-muted)]">Egypt</div>

                {/* Key location markers */}
                <div className="absolute top-[40%] left-[20%] w-2 h-2 rounded-full bg-[var(--accent-sand)]/50"></div>
                <span className="absolute top-[42%] left-[21%] text-xs text-[var(--foreground-muted)]">Tripoli</span>

                <div className="absolute top-[40%] left-[45%] w-2 h-2 rounded-full bg-[var(--accent-sand)]/50"></div>
                <span className="absolute top-[42%] left-[46%] text-xs text-[var(--foreground-muted)]">Tobruk</span>

                <div className="absolute top-[45%] right-[12%] w-2 h-2 rounded-full bg-[var(--accent-sand)]/50"></div>
                <span className="absolute top-[47%] right-[8%] text-xs text-[var(--foreground-muted)]">El Alamein</span>

                {/* Allied positions */}
                {showAllied && timelinePhases[currentPhase].alliedPositions.map((pos, idx) => (
                  <div
                    key={`allied-${idx}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className={`w-5 h-5 rounded-full ${pos.type === 'advance' ? 'bg-green-500 animate-pulse' : pos.type === 'objective' ? 'bg-yellow-400' : 'bg-blue-500'} shadow-lg`}></div>
                    <span className="absolute left-6 top-0 text-xs bg-blue-900/90 text-white px-2 py-0.5 rounded whitespace-nowrap font-medium">
                      {pos.name}
                    </span>
                  </div>
                ))}

                {/* Axis positions */}
                {showAxis && timelinePhases[currentPhase].axisPositions.map((pos, idx) => (
                  <div
                    key={`axis-${idx}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className="w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-sm shadow-lg"></div>
                    <span className="absolute left-6 top-0 text-xs bg-gray-800/90 text-gray-200 px-2 py-0.5 rounded whitespace-nowrap font-medium">
                      {pos.name}
                    </span>
                  </div>
                ))}

                {/* Current phase info overlay */}
                <div className="absolute top-4 left-4 bg-black/80 p-4 rounded-lg max-w-sm border border-white/10">
                  <div className="text-[var(--accent-sand)] font-mono text-sm mb-1">
                    {timelinePhases[currentPhase].time}
                  </div>
                  <h3 className="font-bold text-white mb-1">{timelinePhases[currentPhase].title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{timelinePhases[currentPhase].description}</p>
                </div>
              </div>

              {/* Timeline Controls */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={playAnimation}
                  disabled={isPlaying}
                  className="btn-primary px-6 disabled:opacity-50"
                >
                  {isPlaying ? 'Playing...' : 'Play Animation'}
                </button>
                <button
                  onClick={() => setCurrentPhase(0)}
                  className="btn-secondary px-6"
                >
                  Reset
                </button>
              </div>

              {/* Phase selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {timelinePhases.map((phase, idx) => (
                  <button
                    key={phase.id}
                    onClick={() => setCurrentPhase(idx)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                      currentPhase === idx
                        ? 'bg-[var(--accent-sand)] text-black'
                        : 'bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80'
                    }`}
                  >
                    <span className="font-mono text-xs block">{phase.time}</span>
                    <span className="font-bold">{phase.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="card p-4">
              <h3 className="font-bold mb-3">Map Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500"></span>
                  <span>Allied Defense</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-500"></span>
                  <span>Allied Advance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-400"></span>
                  <span>Key Objective</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm bg-gray-600 border-2 border-gray-400"></span>
                  <span>Axis Forces</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Locations View */}
        {activeTab === 'locations' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-3">
              <h2 className="font-bold mb-3">Key Locations</h2>
              {locations.map(location => (
                <button
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedLocation?.id === location.id
                      ? 'border-[var(--accent-sand)] bg-[var(--accent-sand)]/10'
                      : 'border-[var(--border)] hover:border-[var(--accent-sand)]/50'
                  }`}
                >
                  <span className="font-bold">{location.name}</span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1 capitalize">{location.type}</p>
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              <div className="card p-6">
                {selectedLocation ? (
                  <>
                    <h3 className="text-xl font-bold mb-4">{selectedLocation.name}</h3>
                    <p className="text-[var(--foreground-muted)] mb-4">{selectedLocation.description}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.coordinates.lat},${selectedLocation.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-block"
                    >
                      Open in Google Maps
                    </a>
                  </>
                ) : (
                  <p className="text-[var(--foreground-muted)]">
                    Select a location to see details
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
