'use client';

import { PopupConfig } from '@/config/popups';
import { useState } from 'react';

interface RegistrationFormProps {
  popupConfig: PopupConfig;
}

export default function RegistrationForm({ popupConfig }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    gender: 'Masculino' as 'Masculino' | 'Femenino' | 'Otro',
    ticketQuantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          popupId: popupConfig.id,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          gender: formData.gender,
          ticketQuantity: formData.ticketQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al procesar la inscripción');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Error de conexión. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'ticketQuantity' ? parseInt(value) : value,
    }));
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-black/70 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            ¡Inscripción Exitosa!
          </h2>
          <p className="text-white/80 mb-2">
            Te has registrado correctamente para:
          </p>
          <p className="text-xl font-semibold text-white mb-4">
            {popupConfig.eventName}
          </p>
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <p className="text-white/70 text-sm mb-1">Tickets solicitados:</p>
            <p className="text-white text-2xl font-bold">{formData.ticketQuantity}</p>
          </div>
          <p className="text-white/60 text-sm">
            Revisa tu correo electrónico para más información.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-black/70 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-3xl font-bold text-white mb-4 uppercase">
          Registrate y participá por uno de los 150 accesos exclusivos
        </h1>
        <div className="text-white/90 space-y-3 mb-4">
          <p className="text-base">
            Para vivir un set íntimo y único el sábado 17.01 de 18 a 20hs en Luxo, La Barra
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-lg border border-white/20">
          <p className="text-white/90 text-sm font-medium">
            IMPORTANTE: Si quedaste seleccionadx vas a recibir un correo con la confirmación en las siguientes 4 HORAS.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Tu nombre"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-white/90 mb-2">
            Apellido
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="Tu apellido"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-white/90 mb-2">
            Género
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            disabled={loading}
          >
            <option value="Femenino">Femenino</option>
          </select>
        </div>

        <div>
          <label htmlFor="ticketQuantity" className="block text-sm font-medium text-white/90 mb-2">
            Cantidad de Tickets
          </label>
          <select
            id="ticketQuantity"
            name="ticketQuantity"
            value={formData.ticketQuantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/30 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            disabled={loading}
          >
            <option value={1}>1 Ticket</option>
            <option value={2}>2 Tickets</option>
          </select>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-black/40 hover:bg-black/50 border border-white/30 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
}
