'use client';

import { useState } from 'react';
import { museumItems } from '@/lib/content-loader';
import ImageWithFallback from '@/components/ImageWithFallback';

const categories = [
  { id: 'all', label: 'All Equipment' },
  { id: 'tank', label: 'Tanks' },
  { id: 'vehicle', label: 'Vehicles' },
  { id: 'aircraft', label: 'Aircraft' },
  { id: 'weapon', label: 'Weapons' },
  { id: 'artillery', label: 'Artillery' },
];

const nations = [
  { id: 'all', label: 'Both Sides' },
  { id: 'allied', label: 'Allied Forces' },
  { id: 'axis', label: 'Axis Forces' },
];

export default function MuseumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNation, setSelectedNation] = useState('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredItems = museumItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.type === selectedCategory;
    const nationMatch = selectedNation === 'all' || item.nation === selectedNation;
    return categoryMatch && nationMatch;
  });

  const currentItem = selectedItem ? museumItems.find(i => i.id === selectedItem) : null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Desert Armoury</h1>
          <p className="text-[var(--foreground-muted)]">
            Explore the weapons, vehicles, and equipment used by Allied and Axis forces during the North African Campaign.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <label className="text-sm text-[var(--foreground-muted)] block mb-2">Filter by Type:</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--accent-sand)] text-black'
                      : 'bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-[var(--foreground-muted)] block mb-2">Filter by Nation:</label>
            <div className="flex flex-wrap gap-2">
              {nations.map(nation => (
                <button
                  key={nation.id}
                  onClick={() => setSelectedNation(nation.id)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedNation === nation.id
                      ? nation.id === 'allied' ? 'bg-blue-600 text-white' :
                        nation.id === 'axis' ? 'bg-gray-600 text-white' :
                        'bg-[var(--accent-sand)] text-black'
                      : 'bg-[var(--background-secondary)] hover:bg-[var(--background-secondary)]/80'
                  }`}
                >
                  {nation.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Item Detail */}
        {currentItem && (
          <div className="card p-6 mb-8 border-[var(--accent-sand)]/50">
            <button
              onClick={() => setSelectedItem(null)}
              className="text-[var(--accent-sand)] hover:underline mb-4 inline-block"
            >
              ← Back to gallery
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="relative aspect-video bg-[var(--background-secondary)] rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src={currentItem.image}
                    alt={currentItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-[var(--foreground-muted)] text-center">
                  {currentItem.imageCredit}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded text-sm ${
                    currentItem.nation === 'allied' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {currentItem.country}
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)] capitalize">
                    {currentItem.type}
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-4">{currentItem.name}</h2>
                <p className="text-[var(--foreground-muted)] mb-6">{currentItem.description}</p>

                <h3 className="font-bold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {Object.entries(currentItem.specifications).map(([key, value]) => (
                    <div key={key} className="bg-[var(--background-secondary)] p-2 rounded">
                      <span className="text-xs text-[var(--foreground-muted)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p className="font-mono text-sm">{value}</p>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold mb-3">Role in the Desert War</h3>
                <p className="text-[var(--foreground-muted)] text-sm">{currentItem.desertRole}</p>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        {!currentItem && (
          <>
            <div className="mb-4 text-sm text-[var(--foreground-muted)]">
              Showing {filteredItems.length} items
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className="card overflow-hidden cursor-pointer hover:border-[var(--accent-sand)]/50 transition-all group"
                >
                  <div className="relative aspect-video bg-[var(--background-secondary)]">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs ${
                      item.nation === 'allied' ? 'bg-blue-600' : 'bg-gray-600'
                    } text-white`}>
                      {item.country}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1 group-hover:text-[var(--accent-sand)] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] capitalize">
                      {item.type}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Compare Section */}
        {!currentItem && (
          <div className="mt-12 card p-6">
            <h2 className="text-xl font-bold mb-4">Allied vs Axis: Tank Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-3 px-2">Tank</th>
                    <th className="text-left py-3 px-2">Nation</th>
                    <th className="text-left py-3 px-2">Main Gun</th>
                    <th className="text-left py-3 px-2">Armor</th>
                    <th className="text-left py-3 px-2">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {museumItems.filter(i => i.type === 'tank').map(tank => (
                    <tr key={tank.id} className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)]">
                      <td className="py-3 px-2 font-bold">{tank.name}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          tank.nation === 'allied' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {tank.country}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{tank.specifications.mainArmament}</td>
                      <td className="py-3 px-2 font-mono text-xs">{tank.specifications.armor}</td>
                      <td className="py-3 px-2 font-mono text-xs">{tank.specifications.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
