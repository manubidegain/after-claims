'use client';

import { useState } from 'react';

interface TicketData {
  orderId: string;
  tckid: string;
  email: string;
  name: string;
  eventid: string;
  etid: string;
}

interface OrderLookupFormProps {
  onOrderFound: (tickets: TicketData[], totalTickets: number) => void;
  onAlreadyRegistered: (quantity: number, registeredEmail: string) => void;
}

export default function OrderLookupForm({ onOrderFound, onAlreadyRegistered }: OrderLookupFormProps) {
  const [tckid, setTckid] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tckid.trim() || !email.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/lookup-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tckid: tckid.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Error al buscar la orden');
      }

      if (data.alreadyRegistered) {
        console.log('Order already registered'); // Debug log
        onAlreadyRegistered(data.registeredQuantity, data.registeredEmail);
      } else {
        console.log('Order found, showing tickets'); // Debug log
        onOrderFound(data.tickets, data.totalTickets);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Key Mood After Party
        </h3>
        <h3 className="text-white/90 mb-2">
          Hangar 33 - Open Doors 4:30
        </h3>
        <p className="text-white/80">
          Ingresa tu número de orden y email para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="tckid" className="block text-white font-medium mb-2">
            Número de Orden
          </label>
          <input
            type="text"
            id="tckid"
            value={tckid}
            onChange={(e) => setTckid(e.target.value)}
            placeholder="Ej: 952508"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-white font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black/40 hover:bg-black/50 disabled:bg-black/20 border border-white/40 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed"
        >
          {loading ? 'Buscando...' : 'Buscar Orden'}
        </button>
      </form>
    </div>
  );
}