'use client';

import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function Modal({ title, isOpen, onClose, children, returnTo }: { title: string; isOpen: boolean; onClose?: () => void; children: React.ReactNode; returnTo?: string }) {
    const router = useRouter();

    if (!isOpen) return null;

    const onCloseHandler = () => {{
        if (onClose) {
            onClose();
        } else {
            router.push(returnTo || '/dashboard/projects');
        }
    }}

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity md:block hidden"
                onClick={onCloseHandler}
            />
            <div className={clsx(
                "relative z-10 flex h-full w-full flex-col bg-white shadow-2xl transition-all",
                "md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-2xl"
            )}>

                {/* <!-- Modal Header --> */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <p className="text-slate-500 text-sm">Design the architectural work breakdown structure</p>
                    </div>

                    <button
                        type="button"
                        onClick={onCloseHandler}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Modal Content */}
                {children}
            </div>

        </div>
    );
}