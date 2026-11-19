import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Intro from './components/Intro';
import Works from './components/Works';
import Services from './components/Services';
import Brief from './components/Brief';
import Team from './components/Team';
import Contact from './components/Contact';
import { useSmoothScroll, ScrollProgress, Cursor, Grain } from './components/Effects';
import './styles/index.css';

function App() {
  useSmoothScroll();
  return (
    <>
      <ScrollProgress />
      <Grain />
      <Cursor />
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <Header />
      <main id="main">
        <Intro />
        <Works />
        <Services />
        <Brief />
        <Team />
        <Contact />
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
