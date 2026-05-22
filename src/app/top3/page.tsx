"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Trophy, X, Save, Check, Pencil, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Show } from "@/components/show-card";

type RankedShow = Show & { rank: number };
type HistoryEntry = { month: string; top3: (RankedShow & { month: string })[] };

export default function Top3Page() {
  const [shows, setShows] = useState<Show[]>([]);
  const [top3, setTop3] = useState<(Show | null)[]>([null, null, null]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchCurrentTop3 = useCallback(async () => {
    const [showsRes, top3Res] = await Promise.all([
      fetch("/api/shows"),
      fetch("/api/top3"),
    ]);
    const showsData: Show[] = await showsRes.json();
    const top3Data: { month: string; top3: RankedShow[] } = await top3Res.json();

    setShows(showsData);
    setMonth(top3Data.month);

    const slots: (Show | null)[] = [null, null, null];
    for (const item of top3Data.top3) {
      if (item.rank >= 1 && item.rank <= 3) {
        slots[item.rank - 1] = {
          id: item.id,
          name: item.name,
          imageUrl: item.imageUrl,
          description: item.description,
        };
      }
    }
    setTop3(slots);
    const hasExisting = top3Data.top3.length > 0;
    setEditing(!hasExisting);
    setSaved(hasExisting);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCurrentTop3();
  }, [fetchCurrentTop3]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/top3?history=true");
      const data: { history: HistoryEntry[] } = await res.json();
      setHistory(data.history);
      setHistoryLoading(false);
    }
    fetchHistory();
  }, []);

  const selectedIds = new Set(top3.filter(Boolean).map((s) => s!.id));

  const addToTop3 = useCallback(
    (show: Show) => {
      const firstEmpty = top3.findIndex((s) => s === null);
      if (firstEmpty === -1) return;
      setTop3((prev) => {
        const next = [...prev];
        next[firstEmpty] = show;
        return next;
      });
      setSaved(false);
    },
    [top3]
  );

  const removeFromTop3 = useCallback((index: number) => {
    setTop3((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setSaved(false);
  }, []);

  const saveTop3 = useCallback(async () => {
    setSaving(true);
    const showIds = top3.filter(Boolean).map((s) => s!.id);
    await fetch("/api/top3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showIds }),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
  }, [top3]);

  const deleteTop3 = useCallback(async () => {
    setDeleting(true);
    await fetch("/api/top3", { method: "DELETE" });
    setTop3([null, null, null]);
    setSaved(false);
    setEditing(true);
    setDeleting(false);
  }, []);

  const formatMonth = (m: string) => {
    if (!m) return "";
    const [year, mo] = m.split("-");
    const date = new Date(Number(year), Number(mo) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const rankLabels = ["#1", "#2", "#3"];
  const rankColors = [
    "text-amber-400",
    "text-slate-300",
    "text-amber-700",
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-heading text-4xl font-800 tracking-tight text-foreground">My Top 3</h1>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-xs font-medium text-amber-400">
            {formatMonth(month)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {editing
            ? "Pick 3 shows for this month, then save."
            : "Your top 3 for this month is saved."}
        </p>
      </div>

      {/* Top 3 Slots */}
      <div className="mb-10 grid grid-cols-3 gap-4 sm:gap-6">
        {top3.map((show, index) => (
          <div key={index} className="group relative">
            {show ? (
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl">
                <Image
                  src={show.imageUrl}
                  alt={show.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 font-heading text-sm font-800 backdrop-blur-sm border ${
                    index === 0 ? 'bg-amber-400/90 text-black border-amber-300/50' :
                    index === 1 ? 'bg-white/20 text-white border-white/30' :
                    'bg-amber-900/80 text-amber-300 border-amber-700/50'
                  }`}>
                    {rankLabels[index]}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-heading text-sm font-700 text-white leading-tight">{show.name}</p>
                </div>
                {editing && (
                  <button
                    onClick={() => removeFromTop3(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-md border border-white/10 transition-all hover:bg-red-600/80 hover:scale-110"
                    aria-label={`Remove ${show.name} from rank ${index + 1}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="relative aspect-2/3 w-full rounded-2xl border border-dashed border-white/15 bg-white/3 flex flex-col items-center justify-center gap-3 transition-colors hover:border-amber-400/30 hover:bg-amber-400/3">
                <span className={`font-heading text-3xl font-800 ${rankColors[index]} opacity-40`}>
                  {rankLabels[index]}
                </span>
                <Trophy className="h-6 w-6 text-muted-foreground opacity-20" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mb-12 flex flex-wrap items-center gap-3">
        {editing ? (
          <>
            <Button
              onClick={saveTop3}
              disabled={saving || top3.every((s) => s === null)}
              size="lg"
              className="bg-amber-400 text-black font-heading font-700 hover:bg-amber-300 transition-all"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Top 3
                </>
              )}
            </Button>
            {top3.some(Boolean) && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => fetchCurrentTop3()}
                disabled={saving}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setEditing(true)}
              className="border-white/15 hover:border-white/30 hover:bg-white/5"
            >
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={deleteTop3}
              disabled={deleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting..." : "Delete Top 3"}
            </Button>
          </>
        )}
        {!editing && saved && (
          <span className="text-sm text-muted-foreground">
            <Check className="mr-1 inline h-3.5 w-3.5 text-green-500" />
            Saved for {formatMonth(month)}.
          </span>
        )}
      </div>

      {/* Show picker — only in editing mode */}
      {editing && (
        <div className="mb-16">
          <h2 className="font-heading mb-5 text-xl font-700 tracking-tight">Pick from all shows</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {shows.map((show) => {
              const isSelected = selectedIds.has(show.id);
              const slotsAvailable = top3.some((s) => s === null);
              return (
                <button
                  key={show.id}
                  onClick={() => !isSelected && addToTop3(show)}
                  disabled={isSelected || !slotsAvailable}
                  className="group relative aspect-2/3 w-full overflow-hidden rounded-xl text-left transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Image
                    src={show.imageUrl}
                    alt={show.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="font-heading text-xs font-600 text-white leading-tight">{show.name}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-400/20 backdrop-blur-[1px]">
                      <div className="rounded-full bg-amber-400 p-2">
                        <Check className="h-5 w-5 text-black" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* History section */}
      <div>
        <div className="mb-6 flex items-center gap-2.5">
          <History className="h-5 w-5 text-amber-400/70" />
          <h2 className="font-heading text-xl font-700 tracking-tight">Previous months</h2>
        </div>

        {historyLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <p className="text-sm text-muted-foreground">No top 3 saved for previous months yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {history.map((entry) => (
              <div key={entry.month}>
                <h3 className="font-heading mb-4 text-sm font-600 uppercase tracking-widest text-muted-foreground">
                  {formatMonth(entry.month)}
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:max-w-sm">
                  {[1, 2, 3].map((rank) => {
                    const show = entry.top3.find((s) => s.rank === rank);
                    return (
                      <div key={rank}>
                        {show ? (
                          <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl">
                            <Image
                              src={show.imageUrl}
                              alt={show.name}
                              fill
                              className="object-cover"
                              sizes="15vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
                            <div className="absolute top-2 left-2">
                              <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 font-heading text-xs font-800 backdrop-blur-sm border ${
                                rank === 1 ? 'bg-amber-400/90 text-black border-amber-300/50' :
                                rank === 2 ? 'bg-white/20 text-white border-white/30' :
                                'bg-amber-900/80 text-amber-300 border-amber-700/50'
                              }`}>
                                #{rank}
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <p className="font-heading text-xs font-600 text-white leading-tight">
                                {show.name}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-2/3 w-full rounded-xl border border-dashed border-white/10 flex items-center justify-center opacity-30">
                            <span className={`font-heading text-lg font-800 ${rankColors[rank - 1]}`}>#{rank}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
