'use client';

import { ACTIVE_POPUP_ID, getPopupConfig } from '@/config/popups';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  const [popupConfig, setPopupConfig] = useState(() => getPopupConfig(ACTIVE_POPUP_ID));
  const formClosed = true;

  useEffect(() => {
    const config = getPopupConfig(ACTIVE_POPUP_ID);
    if (!config) {
      console.error('Popup configuration not found');
    }
    setPopupConfig(config);
  }, []);

  if (!popupConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-teal-400 to-cyan-500">
        <div className="text-white text-xl">Evento no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-orange-400">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('${popupConfig.backgroundImage}')`,
          backgroundBlendMode: 'overlay'
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Event Banner */}
          <div className="flex justify-center mb-8">
            <Image
              src="/PopUp_Chris_Banner.png"
              alt={popupConfig.eventName}
              width={1200}
              height={900}
              className="w-full max-w-4xl h-auto rounded-lg"
              priority
            />
          </div>

          {/* Registration Form */}
          {formClosed ? (
            <div className="w-full max-w-md mx-auto p-8 bg-black/70 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Inscripciones Cerradas
                </h3>
                <p className="text-white/80">
                  Se alcanzó el límite de inscripciones para este evento. Gracias por acompañarnos!
                </p>
              </div>
            </div>
          ) : (
            <RegistrationForm popupConfig={popupConfig} />
          )}
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
              <Image
                src="/LogoKEY_Blanco.png"
                alt="KEY"
                width={100}
                height={50}
                className="w-auto h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
