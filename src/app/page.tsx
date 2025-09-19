'use client';

import Image from 'next/image';

export default function Home() {

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-400 via-teal-400 to-cyan-500">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ 
          backgroundImage: "url('/KMood_After_Banner.jpg')",
          backgroundBlendMode: 'overlay'
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <Image
                src="/key-mood-logo.svg"
                alt="KEY MOOD"
                width={200}
                height={100}
                className="w-auto h-16 md:h-20"
              />
            </div>
            <div className="text-right text-white">
              <div className="text-sm md:text-base font-light">SAB_</div>
              <div className="text-lg md:text-xl font-bold">20.09.2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          {/* Event Title */}
          <div className="text-center mb-12">
            <div className="text-white text-lg md:text-xl font-light mb-2 tracking-widest">
              / KEY MOOD
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-widest">
              CLOSING SHOW
            </h2>
            <div className="text-white text-lg md:text-xl font-light mb-2">
              TEMPLE GATE
            </div>
            <div className="text-white text-lg md:text-xl font-light">
              GABRIEL GIL B2B ENZO MONZA
            </div>
          </div>

          {/* Cross Symbol */}
          <div className="flex justify-center mb-12">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-4 bg-white/90 rotate-45"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-4 bg-white/90 -rotate-45"></div>
              </div>
            </div>
          </div>

          {/* Closed Form Message */}
          <div className="bg-black/70 backdrop-blur-md rounded-2xl p-8 border border-white/30">
            <div className="w-full max-w-md mx-auto text-center">
              <div className="text-white text-xl font-medium">
                Muchas gracias, el formulario está cerrado
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end">
            <div className="text-left text-white">
              <div className="text-base font-light opacity-90 flex items-center gap-4">
                powered by
                <Image
                  src="/Entraste_Logo.png"
                  alt="Entraste"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-sm font-light mb-2">AT HANGAR 33</div>
              <div className="text-xs font-light">04:30 A 09 HS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
