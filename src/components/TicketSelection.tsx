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

interface TicketSelectionProps {
  ticketsData: TicketData[];
  totalTickets: number;
  onBack: () => void;
}

export default function TicketSelection({ ticketsData, totalTickets, onBack }: TicketSelectionProps) {
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleTicket = (tckid: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(tckid)) {
      newSelected.delete(tckid);
    } else {
      newSelected.add(tckid);
    }
    setSelectedTickets(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTickets.size === 0) {
      setError('Por favor selecciona al menos un ticket');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/update-after-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: ticketsData[0].orderId,
          email: ticketsData[0].email,
          quantity: selectedTickets.size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar los tickets');
      }

      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
        onBack(); // Volver al home después del éxito
      }, 10000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar los tickets');
    } finally {
      setLoading(false);
    }
  };


  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6 mb-6">
          <div className="text-green-200 text-lg font-medium mb-2">
            Listo! El/los QR te llegará/n al mail con el que realizaste la compra horas antes al Closing Show.

Nos vemos el 20.9 a partir de las 04 am en Hangar 33
          </div>
          <p className="text-green-200/80">
            Has seleccionado {selectedTickets.size} ticket{selectedTickets.size !== 1 ? 's' : ''} para el Key Mood Closing Show
          </p>
        </div>
        
        <button
          onClick={onBack}
          className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          Buscar otra orden
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          ¡Tickets encontrados!
        </h3>
        <div className="text-white/80 space-y-1">
          <p><strong>Nombre:</strong> {ticketsData[0].name}</p>
          <p><strong>Email:</strong> {ticketsData[0].email}</p>
          <p><strong>Orden:</strong> #{ticketsData[0].orderId}</p>
          <p><strong>Total tickets válidos:</strong> {totalTickets}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white font-medium mb-3">
            Selecciona los tickets que quieres usar para el Key Mood Closing Show:
          </label>
          <div className="space-y-3">
            {ticketsData.map((ticket) => (
              <div
                key={ticket.tckid}
                onClick={() => toggleTicket(ticket.tckid)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedTickets.has(ticket.tckid)
                    ? 'bg-white/20 border-white/60 text-white'
                    : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Ticket #{ticket.tckid}</p>
                    <p className="text-sm opacity-75">ETID: {ticket.etid}</p>
                  </div>
                  <div className="text-right">
                    {selectedTickets.has(ticket.tckid) ? '✓ Seleccionado' : 'Seleccionar'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-2">
            Has seleccionado {selectedTickets.size} de {totalTickets} tickets disponibles
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm"
            disabled={loading}
          >
            Volver
          </button>
          
          <button
            type="submit"
            disabled={loading || selectedTickets.size === 0}
            className="flex-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 border border-white/30 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 backdrop-blur-sm disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : `Confirmar ${selectedTickets.size} tickets`}
          </button>
        </div>
      </form>
    </div>
  );
}