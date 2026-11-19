import { useEffect, useRef, useState } from 'react';
import { telegram } from '../data/team';
import { ThemeToggle } from './Effects';

const links = [
  ['Работы', '#works'],
  ['Что делаем', '#services'],
  ['Заявка', '#brief'],
  ['Команда', '#team'],
  ['Связаться', '#contact'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="header">
      <div className="wrap header-row">
        <a className="logo" href="#top" aria-label="KODEN, в начало страницы">KODEN</a>
        <button
          ref={button}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Закрыть' : 'Меню'}
        </button>
        <nav id="nav" aria-label="Разделы страницы" className={open ? 'open' : ''}>
          {links.map(([text, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{text}</a>
          ))}
          <a className="nav-tg" href={telegram} target="_blank" rel="noopener noreferrer">Telegram ↗</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
