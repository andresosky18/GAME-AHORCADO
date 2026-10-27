'use client';
import React from 'react';

/* 12 Flat-Vector Illustrated Character Portraits matching the reference podium aesthetic */
export const AVATAR_META: Record<string, { label: string; bg: string }> = {
  '🦊': { label: 'Manuel', bg: '#C5F58A' },
  '🐼': { label: 'Emily', bg: '#D6F5B0' },
  '🐸': { label: 'Diana', bg: '#B8EC83' },
  '🐯': { label: 'Lucas', bg: '#FFE8A3' },
  '🐨': { label: 'Sofía', bg: '#D0F0FD' },
  '🦁': { label: 'Mateo', bg: '#FFD6BA' },
  '🐙': { label: 'Valeria', bg: '#F5D0FE' },
  '🦄': { label: 'Camila', bg: '#FDE2E4' },
  '🤖': { label: 'Diego', bg: '#E0E7FF' },
  '👽': { label: 'Nico', bg: '#CCFBF1' },
  '🐧': { label: 'Elena', bg: '#FEF08A' },
  '🐱': { label: 'Leo', bg: '#FFEDD5' },
};

export function AvatarGraphic({ id = '🦊', className = '' }: { id?: string; className?: string }) {
  switch (id) {
    case '🦊': // Character 1: Manuel (Ginger short hair, yellow V-neck shirt - like #1 on podium)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#E9D949"/>
          <path d="M32 56L40 66L48 56" fill="#F4A27E"/>
          <rect x="35" y="44" width="10" height="15" rx="5" fill="#EE9B77"/>
          <circle cx="27" cy="36" r="4" fill="#EE9B77"/>
          <circle cx="53" cy="36" r="4" fill="#EE9B77"/>
          <rect x="28" y="20" width="24" height="30" rx="12" fill="#F7AD8B"/>
          <path d="M26 30C26 19 32 14 41 14C50 14 55 20 54 30C51 24 46 22 40 22C33 22 29 25 26 30Z" fill="#DF642A"/>
          <circle cx="35" cy="34" r="1.8" fill="#2B1E1A"/>
          <circle cx="45" cy="34" r="1.8" fill="#2B1E1A"/>
          <path d="M40 35V39" stroke="#D97F5C" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M36 43C38 45 42 45 44 43" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      );

    case '🐼': // Character 2: Emily (Curly ginger/auburn hair, overalls & lavender shirt - like #2 on podium)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="24" cy="32" r="9" fill="#E0632B"/>
          <circle cx="56" cy="32" r="9" fill="#E0632B"/>
          <circle cx="28" cy="21" r="9" fill="#E0632B"/>
          <circle cx="52" cy="21" r="9" fill="#E0632B"/>
          <circle cx="40" cy="18" r="10" fill="#E0632B"/>
          <path d="M17 78C17 62 27 56 40 56C53 56 63 62 63 78" fill="#C4B5FD"/>
          <path d="M26 58L30 78H50L54 58H48L46 68H34L32 58H26Z" fill="#312E5F"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#F09E7E"/>
          <rect x="29" y="22" width="22" height="28" rx="11" fill="#F8AD8D"/>
          <path d="M29 28C32 22 48 22 51 28C48 21 32 21 29 28Z" fill="#E0632B"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#2B1E1A"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#2B1E1A"/>
          <path d="M37 43C39 44.5 41 44.5 43 43" stroke="#C96A4B" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );

    case '🐸': // Character 3: Diana (Dark purple top bun, violet tank top - like #3 on podium)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="13" r="7.5" fill="#2E1A47"/>
          <path d="M18 78C18 62 27 57 40 57C53 57 62 62 62 78" fill="#F5A686"/>
          <path d="M26 58L29 78H51L54 58C48 64 32 64 26 58Z" fill="#7E3AF2"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#EA9574"/>
          <circle cx="28" cy="36" r="3.5" fill="#EA9574"/>
          <circle cx="52" cy="36" r="3.5" fill="#EA9574"/>
          <rect x="29" y="21" width="22" height="28" rx="11" fill="#F5A686"/>
          <path d="M28 31C28 21 33 17 40 17C47 17 52 21 52 31C48 26 44 25 40 25C36 25 32 26 28 31Z" fill="#2E1A47"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#2E1A47"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#2E1A47"/>
          <path d="M37 42.5C39 44 41 44 43 42.5" stroke="#B85D43" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      );

    case '🐯': // Character 4: Lucas (Cool glasses, dark wavy hair, emerald hoodie)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M16 78C16 61 26 55 40 55C54 55 64 61 64 78" fill="#10B981"/>
          <path d="M33 55L40 65L47 55" fill="#FFFFFF"/>
          <rect x="35" y="44" width="10" height="14" rx="5" fill="#D98A6C"/>
          <rect x="28" y="20" width="24" height="29" rx="12" fill="#E8997A"/>
          <path d="M26 29C25 18 33 13 41 14C50 14 55 19 54 29C50 23 32 22 26 29Z" fill="#1E293B"/>
          <rect x="30" y="31" width="8.5" height="6.5" rx="2" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.35"/>
          <rect x="41.5" y="31" width="8.5" height="6.5" rx="2" stroke="#1E293B" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.35"/>
          <path d="M38.5 34H41.5" stroke="#1E293B" strokeWidth="2"/>
          <path d="M36 43C38.5 44.8 41.5 44.8 44 43" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '🐨': // Character 5: Sofía (Blonde bob hair, coral sweater, gold earrings)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M23 34C23 19 30 14 40 14C50 14 57 19 57 34V47C57 50 54 52 51 52H29C26 52 23 50 23 47V34Z" fill="#FBBF24"/>
          <path d="M17 78C17 62 27 56 40 56C53 56 63 62 63 78" fill="#FB7185"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#F3A688"/>
          <circle cx="27" cy="40" r="2.5" fill="#F59E0B"/>
          <circle cx="53" cy="40" r="2.5" fill="#F59E0B"/>
          <rect x="29" y="22" width="22" height="27" rx="11" fill="#FBC1A8"/>
          <path d="M28 30C31 21 48 21 52 30C50 20 30 20 28 30Z" fill="#F59E0B"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#1E293B"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#1E293B"/>
          <path d="M36.5 42.5C38.5 44.2 41.5 44.2 43.5 42.5" stroke="#E11D48" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '🦁': // Character 6: Mateo (Afro hair, headphones on neck, orange jersey)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="40" cy="24" r="17" fill="#1F2937"/>
          <circle cx="27" cy="24" r="10" fill="#1F2937"/>
          <circle cx="53" cy="24" r="10" fill="#1F2937"/>
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#F97316"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#9A5B3E"/>
          <rect x="29" y="23" width="22" height="27" rx="11" fill="#B06C4D"/>
          <circle cx="35.5" cy="35" r="1.8" fill="#111827"/>
          <circle cx="44.5" cy="35" r="1.8" fill="#111827"/>
          <path d="M36 42.5C38.5 44.5 41.5 44.5 44 42.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
          <rect x="28" y="51" width="7" height="9" rx="3.5" fill="#374151"/>
          <rect x="45" y="51" width="7" height="9" rx="3.5" fill="#374151"/>
        </svg>
      );

    case '🐙': // Character 7: Valeria (Twin space buns, teal jacket)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <circle cx="25" cy="17" r="7" fill="#3B1D5E"/>
          <circle cx="55" cy="17" r="7" fill="#3B1D5E"/>
          <path d="M17 78C17 62 27 56 40 56C53 56 63 62 63 78" fill="#06B6D4"/>
          <path d="M35 56V78H45V56" fill="#FEF08A"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#EC9A7B"/>
          <rect x="29" y="22" width="22" height="27" rx="11" fill="#F7B094"/>
          <path d="M28 31C29 20 51 20 52 31C47 25 33 25 28 31Z" fill="#3B1D5E"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#1E1B4B"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#1E1B4B"/>
          <path d="M37 42.5C39 44.2 41 44.2 43 42.5" stroke="#BE185D" strokeWidth="1.9" strokeLinecap="round"/>
        </svg>
      );

    case '🦄': // Character 8: Camila (Long pastel pink-purple hair, mint collar shirt)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M22 30C22 16 30 13 40 13C50 13 58 16 58 30V54H22V30Z" fill="#A855F7"/>
          <path d="M17 78C17 62 27 56 40 56C53 56 63 62 63 78" fill="#14451F"/>
          <path d="M32 56L40 64L48 56" fill="#A9F06A"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#F1A386"/>
          <rect x="29" y="22" width="22" height="27" rx="11" fill="#FBB9A1"/>
          <path d="M28 31C30 21 50 21 52 31C46 25 34 25 28 31Z" fill="#9333EA"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#1E1B4B"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#1E1B4B"/>
          <path d="M37 42.5C39 44 41 44 43 42.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '🤖': // Character 9: Diego (Red beanie cap, beard/stubble, navy jacket)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#1E3A8A"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#D98B6C"/>
          <rect x="28" y="21" width="24" height="28" rx="12" fill="#EA9E80"/>
          <path d="M29 39C29 45 34 49 40 49C46 49 51 45 51 39C48 41 32 41 29 39Z" fill="#475569" fillOpacity="0.35"/>
          <path d="M26 26C26 16 32 12 40 12C48 12 54 16 54 26H26Z" fill="#EF4444"/>
          <rect x="24" y="23" width="32" height="6" rx="3" fill="#DC2626"/>
          <circle cx="35.5" cy="34" r="1.8" fill="#0F172A"/>
          <circle cx="44.5" cy="34" r="1.8" fill="#0F172A"/>
          <path d="M37 42.5H43" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '👽': // Character 10: Nico (Electric blue hair, visor shades, lime shirt)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#84CC16"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#E5987B"/>
          <rect x="28" y="21" width="24" height="28" rx="12" fill="#F3AA8E"/>
          <path d="M26 28L31 14L38 20L44 12L50 20L55 16L53 29H26Z" fill="#2563EB"/>
          <rect x="29" y="30" width="22" height="7" rx="3.5" fill="#0F172A"/>
          <path d="M32 32H39" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M36.5 43C38.5 44.5 41.5 44.5 43.5 43" stroke="#9A3412" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '🐧': // Character 11: Elena (Wavy dark hair, pearl necklace, yellow blazer)
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M22 32C22 17 30 13 40 13C50 13 58 17 58 32V52H22V32Z" fill="#1E293B"/>
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#FACC15"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#D58768"/>
          <circle cx="35" cy="56" r="2" fill="#FFFFFF"/>
          <circle cx="40" cy="57.5" r="2" fill="#FFFFFF"/>
          <circle cx="45" cy="56" r="2" fill="#FFFFFF"/>
          <rect x="29" y="22" width="22" height="27" rx="11" fill="#E4987A"/>
          <path d="M28 30C32 21 48 21 52 30C47 24 33 24 28 30Z" fill="#1E293B"/>
          <circle cx="35.5" cy="35" r="1.7" fill="#0F172A"/>
          <circle cx="44.5" cy="35" r="1.7" fill="#0F172A"/>
          <path d="M37 42.5C39 44 41 44 43 42.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );

    case '🐱': // Character 12: Leo (Baseball cap backwards, sporty polo)
    default:
      return (
        <svg className={`customAvatarSvg ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
          <path d="M16 78C16 62 26 56 40 56C54 56 64 62 64 78" fill="#6366F1"/>
          <path d="M33 56L40 65L47 56" fill="#FFFFFF"/>
          <rect x="35" y="45" width="10" height="14" rx="5" fill="#E79B7E"/>
          <rect x="28" y="21" width="24" height="28" rx="12" fill="#F5AC90"/>
          <path d="M27 27C27 17 33 14 40 14C47 14 53 17 53 27H27Z" fill="#F59E0B"/>
          <rect x="46" y="23" width="13" height="5" rx="2.5" fill="#D97706"/>
          <circle cx="35.5" cy="35" r="1.8" fill="#1E293B"/>
          <circle cx="44.5" cy="35" r="1.8" fill="#1E293B"/>
          <path d="M36 42.5C38.5 44.5 41.5 44.5 44 42.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
      );
  }
}
