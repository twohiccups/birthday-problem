'use client';

import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = '', children, ...props }: ButtonProps) {
    return (
        <button
            className={`
                font-sans
        px-3 text-xs sm:text-base py-1.5 
        rounded-2xl shadow-sm border 
        hover:shadow hover:bg-neutral-50 
        hover:text-black
        active:scale-95
        min-w-20 shrink-0 
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}
