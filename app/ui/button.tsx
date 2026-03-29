import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button {...rest} className={clsx("group relative inline-flex items-center overflow-hidden rounded-sm bg-blue-600 px-8 py-3 text-white", className)}>
      <span className="absolute -start-full transition-all group-hover:start-4">
        <svg className="size-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </span>

      <span className="text-sm font-medium transition-all group-hover:ms-4">       {children} </span>
    </button>
  );
}
