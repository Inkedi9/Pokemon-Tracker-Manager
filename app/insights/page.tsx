"use client";

import { BrainCircuit } from "lucide-react";

import { IntelligenceDashboard } from "@/components/insights/intelligence-dashboard";

export default function InsightsPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-400/5">
                            <BrainCircuit className="h-5 w-5 text-violet-400" />
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                                Collection Intelligence
                            </h1>

                            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                                Une vue intelligente de l&apos;état et de l&apos;évolution de ta collection.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard content */}
                <IntelligenceDashboard />
            </div>
        </div>
    );
}
