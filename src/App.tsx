import './App.css';
import { useSEO } from './hooks/useSEO';
import SentimentDashboard from './components/SentimentDashboard';

function App() {
  useSEO({
    title: 'Analizador de Sentimientos - Análisis de Texto con IA',
    description:
      'Herramienta para analizar el sentimiento de tus textos usando inteligencia artificial',
    keywords:
      'sentimientos, análisis de texto, IA, machine learning, procesamiento de lenguaje natural',
  });

  return <SentimentDashboard />;
}

export default App;
