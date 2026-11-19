import { useState } from 'react';
import { telegram, telegramHandle } from '../data/team';

export default function Contact() {
  const [status, setStatus] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(telegramHandle);
      setStatus('Скопировано');
    } catch {
      setStatus('Не получилось, скопируйте вручную');
    }
    setTimeout(() => setStatus(''), 2500);
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <h2 id="contact-h">Связаться</h2>
        <p className="contact-text">
          Пишите Александру в Telegram. Сразу расскажите, какой сайт нужен и к какому сроку,
          и пришлите пару ссылок на сайты, которые вам нравятся.
        </p>
        <div className="contact-row">
          <a className="contact-handle" href={telegram} target="_blank" rel="noopener noreferrer">
            {telegramHandle}
          </a>
          <button type="button" className="btn btn-ghost" onClick={copy}>
            Скопировать ник
          </button>
          <span className="copy-status" role="status">{status}</span>
        </div>
        <footer className="footer">
          <p>© {new Date().getFullYear()} KODEN</p>
          <p>
            Скриншоты сняты с опубликованных сайтов проектов. Компания Nike, Илон Маск и Марк
            Цукерберг к KODEN отношения не имеют: это независимые проекты о них.
          </p>
          <a href="#top">Наверх ↑</a>
        </footer>
      </div>
    </section>
  );
}
