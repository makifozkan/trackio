import { generateIdeas } from "@/app/lib/gemini-actions";
import Card from "@/app/ui/dashboard/hyperui-card";
import InspirationalIdeaCards from "@/app/ui/dashboard/inspirational-idea-cards";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CardsSkeleton } from "@/app/ui/skeletons";
import Link from "next/link";

export default function Page() {

    async function handleRegenerate() {
        "use server"; // This turns the function into a Server Action
        revalidatePath("/dashboard/ideas");
    }

    return (<div>
        <div className="block p-4 shadow-xs shadow-indigo-100">
            <div className="mx-auto grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                <Suspense key={randomUUID()} fallback={<CardsSkeleton />}>
                    <InspirationalIdeaCards />
                </Suspense>
            </div>
            <div className="h-10"></div>
            <div className="flex justify-between ">
                <h1 className="mt-4">Ideas</h1>

                <Link href='/dashboard/ideas/create' className="block bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                    Add a new idea
                </Link>
            </div>
        </div>
    </div>);
}