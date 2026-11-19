import { useState } from 'react';
import { projects } from '../data/projects';
import { telegram } from '../data/team';
import { SplitWords } from './Effects';

export default function Intro() {
  const [active, setActive] = useState(projects[0]);

  return (
    <section id="top" className="intro wrap">
      <div className="intro-text">
        <h1 className="split"><SplitWords text={'KODEN делает сайты и Telegram-ботов. Нас трое.'} /></h1>
        <p className="intro-lead">
          Александр и Григорий пишут код, Михаил рисует интерфейсы. Здесь {projects.length === 8 ? 'восемь' : projects.length} наших сайтов:
          все опубликованы, и каждый можно пролистать прямо здесь, от первого экрана до подвала.
        </p>
        <div className="intro-actions">
          <a className="btn" href="#brief">Собрать заявку</a>
          <a className="intro-tg" href={telegram} target="_blank" rel="noopener noreferrer">или сразу в Telegram ↗</a>
        </div>
      </div>

      <div className="intro-index">
        <ol className="index-list" onMouseLeave={() => setActive(projects[0])}>
          {projects.map((p) => (
            <li key={p.slug}>
              <a
                href={`#${p.slug}`}
                className={active.slug === p.slug ? 'is-active' : ''}
                onMouseEnter={() => setActive(p)}
                onFocus={() => setActive(p)}
                data-cursor="К проекту ↓"
              >
                <span className="index-title">{p.title}</span>
                <span className="index-kind">{p.kind}</span>
              </a>
            </li>
          ))}
        </ol>
        <figure className="index-preview" aria-hidden="true">
          <img src={`./images/projects/${active.slug}.webp`} alt="" width="1348" height="860" />
          <figcaption>{active.title}</figcaption>
        </figure>
      </div>
    </section>
  );
}
