'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import RoomForm from '../components/RoomForm';
import JoinRoomForm from '../components/JoinRoomForm';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'create'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏠 Criar Nova Sala
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('join')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'join'
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            🚪 Entrar em Sala
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'create' ? (
            <RoomForm />
          ) : (
            <JoinRoomForm />
          )}
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Votação Secreta
          </h3>
          <p className="text-gray-600">
            Vote de forma anônima até que todos os votos sejam revelados
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tempo Real
          </h3>
          <p className="text-gray-600">
            Comunicação instantânea via WebSockets para uma experiência fluida
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Colaboração
          </h3>
          <p className="text-gray-600">
            Até 10 participantes por sala para equipes ágeis
          </p>
        </div>
      </div>
    </div>
  );
}
