'use client';

import React, { useEffect, useState } from 'react';
import { Database, CheckCircle, ShieldAlert } from 'lucide-react';

export default function DatabaseBadge() {
  const [dbInfo, setDbInfo] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setDbInfo(data))
      .catch(() => {});
  }, []);

  if (!dbInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
      <div className="bg-white/95 backdrop-blur-sm border border-[#E8E4D8] rounded-full px-3 py-1.5 shadow-card text-[11px] font-medium text-[#292824] flex items-center gap-2">
        <Database className="w-3.5 h-3.5 text-[#77736A]" />
        <span>DB:</span>
        {dbInfo.isSupabaseConnected ? (
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Supabase / PostgreSQL Live
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[#77736A]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            PostgreSQL / Supabase Engine Ready
          </span>
        )}
      </div>
    </div>
  );
}
