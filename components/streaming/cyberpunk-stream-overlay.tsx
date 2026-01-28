'use client';

import React, { useState, useEffect } from 'react';
import { Users, Heart, DollarSign, Zap } from 'lucide-react';

interface StreamOverlayProps {
  streamerName: string;
  viewers: number;
  isLive: boolean;
}

interface Alert {
  id: string;
  type: 'follower' | 'donation' | 'subscriber';
  username: string;
  amount?: number;
  timestamp: number;
}

export function CyberpunkStreamOverlay({ streamerName, viewers, isLive }: StreamOverlayProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [latestFollower, setLatestFollower] = useState<string>('');
  const [latestDonation, setLatestDonation] = useState<{ user: string; amount: number } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: Alert['type'][] = ['follower', 'donation', 'subscriber'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newAlert: Alert = {
          id: Date.now().toString(),
          type,
          username: `Usuario${Math.floor(Math.random() * 1000)}`,
          amount: type === 'donation' ? Math.floor(Math.random() * 50) + 5 : undefined,
          timestamp: Date.now(),
        };

        if (type === 'follower') {
          setLatestFollower(newAlert.username);
        } else if (type === 'donation' && newAlert.amount) {
          setLatestDonation({ user: newAlert.username, amount: newAlert.amount });
        }

        setAlerts(prev => [...prev, newAlert]);
        
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
        }, 5000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Marco Principal del Video */}
      <div className="absolute inset-0 p-8 md:p-12">
        <div className="relative w-full h-full">
          {/* Esquinas superiores con efecto neón */}
          <CyberCorner position="top-left" />
          <CyberCorner position="top-right" />
          <CyberCorner position="bottom-left" />
          <CyberCorner position="bottom-right" />

          {/* Panel inferior con nombre del streamer - ELIMINADO */}
          {/* <StreamerNamePanel 
            streamerName={streamerName}
            viewers={viewers}
            latestFollower={latestFollower}
            latestDonation={latestDonation}
          /> */}
        </div>
      </div>

      {/* Panel lateral derecho - ELIMINADO */}
      {/* <SidePanel viewers={viewers} isLive={isLive} /> */}

      {/* Botones de SUBSCRIBER */}
      <SubscriberAlerts alerts={alerts.filter(a => a.type === 'subscriber').slice(-3)} />

      {/* Alertas flotantes */}
      <FloatingAlerts alerts={alerts.filter(a => a.type === 'follower' || a.type === 'donation').slice(-2)} />
    </div>
  );
}


// Componente de esquina cyberpunk
function CyberCorner({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  const borders = {
    'top-left': 'border-t-2 border-l-2',
    'top-right': 'border-t-2 border-r-2',
    'bottom-left': 'border-b-2 border-l-2',
    'bottom-right': 'border-b-2 border-r-2'
  };

  return (
    <div className={`absolute ${positions[position]} w-32 h-32`}>
      <div className={`absolute ${position.includes('top') ? 'top-0' : 'bottom-0'} ${position.includes('left') ? 'left-0' : 'right-0'} w-full h-1 bg-gradient-to-${position.includes('left') ? 'r' : 'l'} from-cyan-400 via-blue-500 to-transparent`}></div>
      <div className={`absolute ${position.includes('top') ? 'top-0' : 'bottom-0'} ${position.includes('left') ? 'left-0' : 'right-0'} w-1 h-full bg-gradient-to-${position.includes('top') ? 'b' : 't'} from-cyan-400 via-blue-500 to-transparent`}></div>
      <div className={`absolute ${position.includes('top') ? 'top-2' : 'bottom-2'} ${position.includes('left') ? 'left-2' : 'right-2'} w-24 h-24 ${borders[position]} border-cyan-400/50`}></div>
    </div>
  );
}

// Panel con nombre del streamer
function StreamerNamePanel({ 
  streamerName, 
  viewers, 
  latestFollower, 
  latestDonation 
}: { 
  streamerName: string; 
  viewers: number; 
  latestFollower: string; 
  latestDonation: { user: string; amount: number } | null;
}) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-[600px]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/90 to-transparent backdrop-blur-md"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute bottom-0 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        <div className="relative px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider">NEW</span>
            <span className="text-white text-xs font-light">FOLLOWER</span>
            {latestFollower && (
              <span className="text-cyan-400 text-xs ml-2 animate-pulse">{latestFollower}</span>
            )}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px currentColor' }}>
              {streamerName.toUpperCase()}
            </div>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400 text-xs">{viewers} espectadores</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider">NEW</span>
            <span className="text-white text-xs font-light">DONATION</span>
            {latestDonation && (
              <span className="text-cyan-400 text-xs ml-2 animate-pulse">
                ${latestDonation.amount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// Panel lateral
function SidePanel({ viewers, isLive }: { viewers: number; isLive: boolean }) {
  return (
    <div className="absolute top-4 right-4 w-80 space-y-4">
      <div className="relative">
        <div className="relative w-full aspect-video bg-gray-900/50 backdrop-blur-sm border-2 border-cyan-400/50 rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>
          
          <div className="w-full h-full flex items-center justify-center text-cyan-400/30">
            <Users className="w-16 h-16" />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-md border-2 border-cyan-400/50 rounded-lg p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 tracking-widest" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              LIVE
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Espectadores</span>
              <span className="text-cyan-400 font-bold">{viewers}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Duración</span>
              <span className="text-cyan-400 font-bold">1h 23m</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}

// Alertas de suscriptores
function SubscriberAlerts({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="relative animate-slide-up">
          <div className="relative bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md border-2 border-purple-400/50 px-6 py-3 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-400 transform -translate-x-1 -translate-y-1"></div>
            
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-purple-400 text-xs font-bold tracking-wider">SUBSCRIBER</div>
                <div className="text-white text-sm font-semibold">{alert.username}</div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Alertas flotantes
function FloatingAlerts({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="relative animate-bounce-in">
          <div className="relative bg-gradient-to-r from-cyan-900/95 to-blue-900/95 backdrop-blur-md border-2 border-cyan-400 px-8 py-4 rounded-lg shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
            
            <div className="relative flex items-center space-x-4">
              {alert.type === 'follower' ? (
                <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
              ) : (
                <DollarSign className="w-8 h-8 text-green-400 animate-pulse" />
              )}
              <div>
                <div className="text-cyan-400 text-sm font-bold tracking-wider">
                  {alert.type === 'follower' ? 'NUEVO SEGUIDOR' : 'NUEVA DONACIÓN'}
                </div>
                <div className="text-white text-xl font-bold">
                  {alert.username}
                  {alert.amount && <span className="text-green-400 ml-2">${alert.amount}</span>}
                </div>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
