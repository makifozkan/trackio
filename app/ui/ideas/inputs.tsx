export function Input({ label = "Email" }: { label: string }) {
    return (
        <label htmlFor="Email" className="relative">
            <input type="email" id="Email" placeholder="" className="peer mt-0.5 w-full rounded-sm border-gray-300 shadow-xs sm:text-sm" />

            <span className="absolute inset-y-0 inset-s-3 -translate-y-5 bg-white px-0.5 text-sm font-medium text-gray-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-5">
                {label}
            </span>
        </label>
    );
}