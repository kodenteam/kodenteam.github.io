import { Fragment, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Плавная инерционная прокрутка колесом + плавные переходы по якорям меню.
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id;
    const raf = (t) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      const target = hash === '#top' ? 0 : document.querySelector(hash);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -72, duration: 1.3 });
      history.replaceState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    window.__lenis = lenis;
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);
}

// Тонкая полоса прогресса прокрутки под шапкой.
export function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let id;
    const tick = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return <div className="progress" ref={bar} aria-hidden="true" />;
}

// Свой курсор: точка и кольцо с подписью. Подпись берётся из data-cursor у элемента
// или подставляется для ссылок. Только для мыши и без reduced-motion.
export function Cursor() {
  const ring = useRef(null);
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!finePointer() || reduced()) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, id, shown = false;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x; ry = y;
        ring.current.classList.add('on');
        dot.current.classList.add('on');
      }
      const t = e.target.closest('[data-cursor], a, button, label, input, textarea');
      const r = ring.current;
      r.classList.remove('is-link', 'is-label', 'is-text');
      label.current.textContent = '';
      if (!t) return;
      if (t.matches('input[type=text], textarea')) {
        r.classList.add('is-text');
      } else if (t.dataset.cursor) {
        r.classList.add('is-label');
        label.current.textContent = t.dataset.cursor;
      } else {
        r.classList.add('is-link');
      }
    };
    const leave = () => {
      shown = false;
      ring.current.classList.remove('on');
      dot.current.classList.remove('on');
    };
    const down = () => ring.current.classList.add('is-down');
    const up = () => ring.current.classList.remove('is-down');
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      dot.current.style.transform = `translate(${x}px, ${y}px)`;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    return () => {
      cancelAnimationFrame(id);
      removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}

// Переключатель темы: новая тема раскрывается кругом из точки клика (View Transitions API).
export function ThemeToggle() {
  const toggle = (e) => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem('koden-theme', next); } catch { /* приватный режим */ }
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', next === 'dark' ? '#131416' : '#eceeef');
    };
    if (!document.startViewTransition || reduced()) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    root.style.setProperty('--vt-x', `${cx}px`);
    root.style.setProperty('--vt-y', `${cy}px`);
    root.style.setProperty('--vt-r', `${Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy))}px`);
    document.startViewTransition(apply);
  };
  return (
    <button type="button" className="theme-toggle" onClick={toggle} data-cursor="Тема">
      <span className="theme-icon" aria-hidden="true" />
      <span className="theme-text-dark">Тёмная тема</span>
      <span className="theme-text-light">Светлая тема</span>
    </button>
  );
}

// Зернистая плёнка поверх страницы, как на сайте про Цукерберга.
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

// Заголовок появляется по словам при загрузке.
export function SplitWords({ text }) {
  const words = text.split(' ');
  return (
    <>
      <span className="sr-only">{text.replace(/ /g, ' ')}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="word">
              <span style={{ animationDelay: `${0.08 + i * 0.07}s` }}>{w}</span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </span>
    </>
  );
}
