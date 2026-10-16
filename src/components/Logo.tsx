import React from 'react';

export const OFFICIAL_LOGO_SRC = '/src/assets/images/ghorob_chams_logo_1792178775871.jpg';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtext?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  badgeOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'dark',
  showSubtext = true,
  size = 'md',
  badgeOnly = false
}) => {
  const isLight = variant === 'light';

  // Sizing maps
  const dimensionClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28'
  }[size];

  if (badgeOnly) {
    return (
      <div
        className={`relative ${dimensionClasses} shrink-0 rounded-full overflow-hidden shadow-md ring-2 ring-sky-900/10 hover:ring-sky-600/30 transition-all ${className}`}
      >
        <img
          src={OFFICIAL_LOGO_SRC}
          alt="إقامة غروب شمس | Ghorob Chams Residence"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Circular Emblem */}
      <div
        className={`relative ${dimensionClasses} shrink-0 rounded-full overflow-hidden shadow-md ring-2 ring-amber-400/30 bg-white p-0.5 transition-transform duration-200 group-hover:scale-105`}
      >
        <img
          src={OFFICIAL_LOGO_SRC}
          alt="إقامة غروب شمس | Ghorob Chams Residence Emblem"
          className="w-full h-full object-cover object-center rounded-full"
          loading="eager"
        />
      </div>

      {/* Typography Brand Lockup */}
      <div className="flex flex-col text-start">
        <div className="flex items-baseline gap-2">
          <span
            className={`font-arabic text-base sm:text-lg font-bold tracking-tight leading-tight ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            إقامة غروب شمس
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${
              isLight ? 'text-amber-300' : 'text-sky-700'
            }`}
          >
            Ghorob Chams
          </span>
        </div>
        {showSubtext && (
          <span
            className={`text-[11px] font-medium tracking-wider uppercase ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Residence · Briech - Asilah
          </span>
        )}
      </div>
    </div>
  );
};
