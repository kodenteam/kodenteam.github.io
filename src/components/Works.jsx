import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';

// Рамка 16:10 (как окно браузера 1280x800), внутри скриншот всей страницы.
// Наведение мышью или кнопка прокручивают его сверху донизу; скорость зависит от длины сайта.
function ScrollShot({ p }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const frame = useRef(null);

  // На сенсорных экранах окно листается вместе со страницей: чем дальше прокручен блок, тем ниже сайт внутри.
  useEffect(() => {
    const touch = matchMedia('(hover: none)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!touch || !frame.current) return;
    const el = frame.current;
    let id;
    const tick = () => {
      const img = el.querySelector('img');
      if (img) {
        const r = el.getBoundingClientRect();
        const start = innerHeight * 0.85, end = innerHeight * 0.1 - r.height;
        const t = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
        img.style.transform = `translateY(${-t * Math.max(0, img.offsetHeight - el.clientHeight)}px)`;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  const seconds = Math.min(16, Math.max(3.5, p.fullRatio * 0.75));
  const screens = Math.round(p.fullRatio * 1.6);

  return (
    <div className="shot-wrap">
      <a
        className={'shot' + (playing ? ' is-playing' : '')}
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ '--dur': `${seconds}s` }}
        data-cursor="Листаю ↓"
        aria-label={`Открыть сайт ${p.title} в новой вкладке`}
      >
        <span className="shot-bar" aria-hidden="true">
          <i /><i /><i />
          <span>{p.title}</span>
        </span>
        <span className="shot-frame" ref={frame}>
          {failed ? (
            <span className="shot-missing">Скриншот не загрузился. Сайт открывается по ссылке.</span>
          ) : (
            <img
              src={`./images/projects/full/${p.slug}.webp`}
              alt={`Страница сайта ${p.title} целиком, сверху вниз`}
              loading="lazy"
              width="768"
              height={Math.round(768 * p.fullRatio)}
              onError={() => setFailed(true)}
            />
          )}
        </span>
      </a>
      <button type="button" className="shot-play" onClick={() => setPlaying(!playing)} aria-pressed={playing}>
        {playing ? 'Вернуться наверх ↑' : `Пролистать сайт целиком ↓`}
        <span className="shot-len">{screens} экранов, {Math.round(seconds)} с</span>
      </button>
    </div>
  );
}

export default function Works() {
  return (
    <section id="works" className="works wrap" aria-labelledby="works-h">
      <h2 id="works-h">Работы</h2>
      {projects.map((p) => (
        <article id={p.slug} key={p.slug} className="work">
          <ScrollShot p={p} />
          <div className="work-text">
            <p className="work-kind">{p.kind}</p>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            {p.inside.length > 0 && (
              <ul className="work-inside">
                {p.inside.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
            <dl className="work-meta">
              <div><dt>Сделано на</dt><dd>{p.stack}</dd></div>
              {p.note && <div><dt>Статус</dt><dd>{p.note}</dd></div>}
            </dl>
            <a className="work-link" href={p.url} target="_blank" rel="noopener noreferrer">
              Открыть сайт ↗
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
