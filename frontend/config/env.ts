export const env = {
  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Planning Poker',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  
  // WebSocket Configuration
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  
  // Feature Flags
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableDebugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  
  // UI Configuration
  maxPlayersPerRoom: parseInt(process.env.NEXT_PUBLIC_MAX_PLAYERS_PER_ROOM || '20'),
  defaultVotingTimeout: parseInt(process.env.NEXT_PUBLIC_DEFAULT_VOTING_TIMEOUT || '300000'),
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type EnvConfig = typeof env;
