import React from "react";
import Link from "next/link";
import { BUTTON } from "@/constants/constants";

interface GameControlsProps {
    onShowStats: () => void;
}

export function GameControls({ onShowStats }: GameControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link href="/scores" className={`${BUTTON.secondary} flex-1 text-center`}>
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
                Score History
            </Link>

            <button onClick={onShowStats} className={`${BUTTON.accent} flex-1`}>
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
                Statistics
            </button>
        </div>
    );
}
