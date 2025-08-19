import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Planning Poker',
  description: 'Sistema de votação de tarefas Planning Poker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🃏 Planning Poker
            </h1>
            <p className="text-gray-600 text-lg">
              Sistema de votação de tarefas para equipes ágeis
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
