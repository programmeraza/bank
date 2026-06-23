import React from 'react';
import { SystemEvent } from '../types';

export default function RecentEventsWidget({ events }: { events: SystemEvent[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <h4 className="font-semibold text-zinc-900">События безопасности</h4>
        <span className="text-xs text-zinc-500">Лента активности</span>
      </div>
      <div className="mt-4 flow-root">
        <ul className="-mb-8">
          {events.map((event, index) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {/* Линия связи между событиями таймлайна */}
                {index !== events.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200" aria-hidden="true" />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white ${
                      event.severity === 'high' 
                        ? 'bg-red-500 text-white' 
                        : event.severity === 'medium' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <span className="text-xs font-bold">!</span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-800">
                      <p className="font-medium text-zinc-950">{event.message}</p>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-zinc-500">
                      <span>{event.category.toUpperCase()}</span>
                      <time dateTime={event.timestamp}>{event.timestamp}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}