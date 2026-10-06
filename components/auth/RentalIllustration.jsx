'use client';

import React from 'react';
import { Camera, Tent, Backpack, Wrench, Laptop, Bike } from 'lucide-react';

function RentalCard({ icon: Icon, title, category, className = '', floatClass = '' }) {
  return (
    <div className={`z-20 ${floatClass} ${className}`}>
      <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#E8E4D8] shadow-[0_2px_10px_rgba(23,38,58,0.05)] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 select-none">
        <div className="w-7 h-7 rounded-xl bg-[#FFF4B8] text-[#17263A] flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#17263A]" />
        </div>
        <div className="text-left min-w-0 pr-1">
          <span className="block text-[11px] font-bold text-[#17263A] leading-tight truncate">
            {title}
          </span>
          <span className="block text-[9.5px] font-medium text-[#64748B] truncate">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RentalIllustration() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none pt-2 pb-4">
      
      {/* Background ambient decorative warm glow */}
      <div className="absolute inset-4 bg-gradient-to-tr from-[#FFF7D6]/70 via-[#FFFBEB]/50 to-transparent rounded-[36px] -z-10 blur-xl pointer-events-none" />

      {/* 6 Feature Rental Cards Arranged Balanced Around Central Illustration */}
      
      {/* 1. TOP LEFT: City Commuter */}
      <RentalCard
        icon={Bike}
        title="City Commuter"
        category="Bikes & Scooters"
        className="absolute top-1 left-1 sm:left-2"
        floatClass="animate-gentle-float"
      />

      {/* 2. TOP RIGHT: 4K Cinema Kit */}
      <RentalCard
        icon={Camera}
        title="4K Cinema Kit"
        category="Photo & Video"
        className="absolute top-1 right-1 sm:right-2"
        floatClass="animate-gentle-float-delayed"
      />

      {/* Decorative Handwritten Phrase Near Upper-Right of Woman */}
      <div className="absolute top-14 right-2 sm:right-6 z-20 transform rotate-[-6deg] pointer-events-none">
        <div className="bg-[#FFF9E6]/95 border border-[#F6B51B]/40 px-2.5 py-1.5 rounded-xl shadow-xs backdrop-blur-xs">
          <p className="font-serif italic text-[11px] sm:text-xs font-bold text-[#D97706] tracking-wide leading-tight text-center">
            Rent • <span className="text-[#B45309]">Explore</span> • Repeat
          </p>
        </div>
      </div>

      {/* 3. MIDDLE / LOWER LEFT: Camp Ready */}
      <RentalCard
        icon={Tent}
        title="Camp Ready"
        category="Tents & Gear"
        className="absolute top-[46%] -translate-y-1/2 -left-1 sm:left-1"
        floatClass="animate-gentle-float-alt"
      />

      {/* 4. MIDDLE / LOWER RIGHT: Trekking Pack */}
      <RentalCard
        icon={Backpack}
        title="Trekking Pack"
        category="Outdoor Travel"
        className="absolute top-[46%] -translate-y-1/2 -right-1 sm:right-1"
        floatClass="animate-gentle-float"
      />

      {/* 5. BOTTOM LEFT: Cordless Tool */}
      <RentalCard
        icon={Wrench}
        title="Cordless Tool"
        category="DIY Equipment"
        className="absolute bottom-2 left-1 sm:left-3"
        floatClass="animate-gentle-float-delayed"
      />

      {/* 6. BOTTOM RIGHT: Creator Rig */}
      <RentalCard
        icon={Laptop}
        title="Creator Rig"
        category="Tech & Consoles"
        className="absolute bottom-2 right-1 sm:right-3"
        floatClass="animate-gentle-float-alt"
      />

      {/* Central Hero 2D Flat Illustration */}
      <div className="w-full flex justify-center items-center py-2">
        <svg
          viewBox="0 0 520 400"
          className="w-[340px] sm:w-[420px] h-auto max-h-[380px] drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="rugGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF4B8" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#FAF0C0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FAF9F4" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beanbagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBD54C" />
              <stop offset="55%" stopColor="#F6B51B" />
              <stop offset="100%" stopColor="#DE9507" />
            </linearGradient>
            <linearGradient id="sweaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F0ECE3" />
            </linearGradient>
            <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22364E" />
              <stop offset="100%" stopColor="#17263A" />
            </linearGradient>
            <linearGradient id="plantPotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E07A5F" />
              <stop offset="100%" stopColor="#C45E44" />
            </linearGradient>
          </defs>

          {/* 1. Soft Elliptical Rug Centered Underneath */}
          <ellipse cx="260" cy="340" rx="200" ry="44" fill="url(#rugGradient)" />
          <ellipse cx="260" cy="340" rx="170" ry="36" stroke="#EFE9D3" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />

          {/* 2. Large Mustard-Yellow Beanbag (Enlarged and Raised) */}
          {/* Beanbag shadow */}
          <ellipse cx="270" cy="348" rx="115" ry="24" fill="#000" fillOpacity="0.07" />
          
          {/* Main Beanbag Body */}
          <path
            d="M165 305 C145 245 170 175 245 155 C320 135 385 180 395 245 C405 315 350 355 270 355 C195 355 175 335 165 305 Z"
            fill="url(#beanbagGradient)"
          />
          {/* Beanbag Contour & Seam Folds */}
          <path d="M195 320 C240 338 310 338 365 305" stroke="#D48B07" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M210 260 C250 295 330 290 370 250" stroke="#D48B07" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
          <path d="M245 170 C290 185 345 198 375 238" stroke="#FFF0A3" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />

          {/* 3. Indoor Plant + Books (Lower-Left, Tucked Close to Woman) */}
          {/* Pot Shadow */}
          <ellipse cx="120" cy="350" rx="22" ry="5" fill="#000" fillOpacity="0.06" />
          {/* Ceramic Pot */}
          <path d="M104 310 L108 348 C109 351 131 351 132 348 L136 310 Z" fill="url(#plantPotGradient)" />
          <ellipse cx="120" cy="310" rx="16" ry="4" fill="#B25036" />
          <ellipse cx="120" cy="311" rx="14" ry="3" fill="#583A2E" />
          {/* Stems & Broad Monstera Leaves Branching Upwards */}
          <path d="M120 311 Q120 250 102 215" stroke="#3D5A45" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M120 311 Q128 240 144 195" stroke="#3D5A45" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M120 311 Q116 265 92 245" stroke="#3D5A45" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          
          {/* Leaves */}
          <path d="M102 215 C80 205 76 185 95 180 C110 176 120 198 102 215 Z" fill="#2D6A4F" />
          <path d="M144 195 C168 185 172 165 154 160 C138 156 128 178 144 195 Z" fill="#40916C" />
          <path d="M92 245 C72 240 68 222 83 218 C98 214 105 232 92 245 Z" fill="#52B788" />
          <path d="M118 180 C126 148 138 148 140 172 C141 188 123 196 118 180 Z" fill="#74C69D" />

          {/* Stack of Books Beside Plant */}
          <rect x="142" cy="0" y="338" width="30" height="6.5" rx="1.5" fill="#C45E44" />
          <rect x="145" y="331" width="26" height="6.5" rx="1.5" fill="#52796F" />
          <rect x="148" y="324" width="22" height="6" rx="1.5" fill="#E9C46A" />

          {/* 4. Young Woman Sitting Relaxed (Raised & Enlarged ~30%) */}
          {/* Lower Body: Legs crossed/tucked comfortably on beanbag */}
          <path
            d="M225 288 C202 288 198 316 238 325 C282 334 354 332 364 310 C370 294 342 278 304 278 Z"
            fill="url(#pantsGradient)"
          />
          {/* Cozy socks on feet */}
          <ellipse cx="218" cy="318" rx="10" ry="6.5" fill="#F4E9CD" />
          <ellipse cx="362" cy="308" rx="10" ry="6.5" fill="#F4E9CD" />

          {/* Torso: Cozy Cream Knit Sweater */}
          <path
            d="M246 195 C228 208 228 272 246 290 C264 302 316 302 334 284 C346 266 340 208 316 195 Z"
            fill="url(#sweaterGradient)"
            stroke="#E5DEC9"
            strokeWidth="1.5"
          />
          {/* Sweater Collar */}
          <path d="M266 194 Q281 203 296 194" stroke="#D5CEBA" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Left Arm & Sleeve extending to laptop */}
          <path
            d="M240 214 C222 238 234 266 260 272"
            stroke="url(#sweaterGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right Arm & Sleeve extending to laptop */}
          <path
            d="M326 214 C342 238 332 264 308 272"
            stroke="url(#sweaterGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hands Typing */}
          <circle cx="265" cy="270" r="7" fill="#FAD2B8" />
          <circle cx="304" cy="270" r="7" fill="#FAD2B8" />

          {/* Laptop Resting on Lap */}
          {/* Base */}
          <rect x="250" y="268" width="72" height="6" rx="2.5" fill="#94A3B8" />
          {/* Screen Open at Natural Angle */}
          <path d="M259 269 L268 230 L322 230 L315 269 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.2" />
          {/* Display Glow */}
          <path d="M270 266 L277 235 L315 235 L308 266 Z" fill="#F8FAFC" />
          {/* Display Elements Hint */}
          <line x1="281" y1="242" x2="308" y2="242" stroke="#F6B51B" strokeWidth="2" strokeLinecap="round" />
          <line x1="279" y1="249" x2="304" y2="249" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="277" y1="256" x2="299" y2="256" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />

          {/* Neck */}
          <rect x="276" y="180" width="12" height="17" rx="3" fill="#FAD2B8" />
          {/* Face */}
          <ellipse cx="282" cy="158" rx="17" ry="20" fill="#FAD2B8" />
          {/* Smiling Eyes */}
          <path d="M274 157 Q277 153 281 157" stroke="#2D3748" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M286 157 Q289 153 293 157" stroke="#2D3748" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* Rosy Cheeks */}
          <circle cx="273" cy="163" r="3.5" fill="#F6A89E" opacity="0.65" />
          <circle cx="294" cy="163" r="3.5" fill="#F6A89E" opacity="0.65" />
          {/* Friendly Smile */}
          <path d="M280 166 Q284 171 288 166" stroke="#E06D53" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          {/* Stylish Hair & Bun */}
          <path
            d="M263 156 C261 130 282 120 299 128 C311 137 304 165 301 174 C293 147 282 142 271 151 C265 156 264 170 263 156 Z"
            fill="#2D2B2A"
          />
          {/* Bun with stylish warm accent tie */}
          <circle cx="283" cy="125" r="12" fill="#2D2B2A" />
          <circle cx="283" cy="125" r="3.5" fill="#E76F51" />

          {/* 5. Sleeping Cat Curled Near Woman's Feet (Lower-Right) */}
          {/* Cat Shadow */}
          <ellipse cx="400" cy="354" rx="25" ry="7" fill="#000" fillOpacity="0.06" />
          {/* Cat Body */}
          <ellipse cx="400" cy="345" rx="20" ry="13" fill="#E76F51" />
          {/* Head */}
          <circle cx="414" cy="342" r="10" fill="#E76F51" />
          {/* Ears */}
          <polygon points="413,333 417,327 421,334" fill="#E76F51" />
          <polygon points="407,333 410,328 413,335" fill="#E76F51" />
          {/* Eyes (closed happy arc) */}
          <path d="M413 343 Q416 345 418 343" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          {/* Tail tucked around */}
          <path d="M385 349 Q378 340 387 336" stroke="#E76F51" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* White Chest Patch */}
          <ellipse cx="402" cy="347" rx="8" ry="5.5" fill="#FFF2E8" />
        </svg>
      </div>

    </div>
  );
}
