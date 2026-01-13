'use client';

import React, { useState, useEffect } from 'react';
import { Radio, RefreshCw, ChevronRight } from 'lucide-react';

type MatchScore = {
    r: number;
    w: number;
    o: number;
    inning: string;
};

type Match = {
    id: string;
    name: string;
    matchType: string;
    status: string;
    venue: string;
    date: string;
    teams: string[];
    score: MatchScore[];
    matchStarted: boolean;
    matchEnded: boolean;
};

export default function CricketScoreWidget() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Replace with your real API key
    const API_KEY = 'ead10e5b-17a6-437d-81b5-1cf49c4cf065';
    const API_BASE = 'https://api.cricapi.com/v1';

    const fetchMatches = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `${API_BASE}/currentMatches?apikey=${API_KEY}&offset=0`
            );
            const data = await response.json();

            if (data?.status === 'success' && Array.isArray(data.data)) {
                const liveMatches: Match[] = data.data
                    .filter(
                        (match: Match) =>
                            match.matchType === 'odi' ||
                            match.matchType === 't20' ||
                            match.matchType === 'test'
                    )
                    .slice(0, 5);

                setMatches(liveMatches);
            } else {
                setError('Failed to fetch matches');
                setMatches([]);
            }
        } catch (err) {
            setError('API Error - Please add your API key');

            // Demo fallback data
            const demoMatches: Match[] = [
                {
                    id: '1',
                    name: 'India vs Australia, 3rd ODI',
                    matchType: 'odi',
                    status: 'Match in progress',
                    venue: 'MCG, Melbourne',
                    date: '2025-01-13',
                    teams: ['India', 'Australia'],
                    score: [
                        { r: 287, w: 6, o: 50, inning: 'India Inning 1' },
                        { r: 156, w: 4, o: 28.3, inning: 'Australia Inning 1' }
                    ],
                    matchStarted: true,
                    matchEnded: false
                },
                {
                    id: '2',
                    name: 'England vs Pakistan, 2nd T20',
                    matchType: 't20',
                    status: 'England won by 7 wickets',
                    venue: "Lord's, London",
                    date: '2025-01-13',
                    teams: ['England', 'Pakistan'],
                    score: [
                        { r: 165, w: 8, o: 20, inning: 'Pakistan Inning 1' },
                        { r: 168, w: 3, o: 18.2, inning: 'England Inning 1' }
                    ],
                    matchStarted: true,
                    matchEnded: true
                }
            ];

            setMatches(demoMatches);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMatches();
        const interval = setInterval(fetchMatches, 30000);
        return () => clearInterval(interval);
    }, []);

    /* =======================
       Match Card
    ======================= */

    const MatchCard = ({ match }: { match: Match }) => {
        const isLive = match.matchStarted && !match.matchEnded;

        return (
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {isLive && (
                            <span className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                                <Radio size={10} className="animate-pulse" />
                                LIVE
                            </span>
                        )}
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                            {match.matchType}
                        </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>

                {/* Match Name */}
                <h3 className="font-semibold text-gray-800 text-sm mb-2">
                    {match.name}
                </h3>

                {/* Scores */}
                {match.score?.length > 0 ? (
                    <div className="space-y-2">
                        {match.score.map((innings, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 font-medium">
                                    {match.teams[idx] ?? `Team ${idx + 1}`}
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    {innings.r}/{innings.w}{' '}
                                    <span className="text-gray-500 font-normal">
                                        ({innings.o})
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">{match.status}</p>
                )}

                {/* Result */}
                {match.matchEnded && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-green-600 font-semibold">
                            {match.status}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    /* =======================
       Render
    ======================= */

    return (
        <div className="container mx-auto max-w-md bg-gray-50 rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Cricket Live Scores</h2>
                    <button
                        onClick={fetchMatches}
                        disabled={loading}
                        className="p-2 hover:bg-white/20 rounded-full disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {loading && matches.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        Loading matches...
                    </p>
                )}

                {!loading && matches.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        No live matches available
                    </p>
                )}

                {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
}
