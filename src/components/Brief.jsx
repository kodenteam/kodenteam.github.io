import { useMemo, useState } from 'react';
import { telegram, telegramHandle } from '../data/team';

const kinds = [
  { id: 'brand', label: 'Сайт компании или бренда', example: ['MaryJoy', '#maryjoy'] },
  { id: 'story', label: 'Спецпроект или лонгрид', example: ['Nike: Beyond Limits', '#nike'] },
  { id: 'bot', label: 'Сайт вместе с Telegram-ботом', example: ['World of Inventions', '#world'] },
  { id: 'unknown', label: 'Пока не знаю, нужен совет', example: null },
];
const sections = ['О компании', 'Услуги или каталог', 'Галерея', 'Контакты и карта', 'Хронология', 'Викторина или тест', 'Форма заявки'];
const ready = ['Логотип', 'Тексты', 'Фотографии', 'Домен'];
const deadlines = ['Без спешки', 'В течение месяца', 'За две недели', 'Срочно'];

const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function Brief() {
  const [kind, setKind] = useState('brand');
  const [picked, setPicked] = useState(['О компании', 'Контакты и карта']);
  const [has, setHas] = useState([]);
  const [deadline, setDeadline] = useState('В течение месяца');
  const [likes, setLikes] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const k = kinds.find((x) => x.id === kind);

  const message = useMemo(() => {
    const lines = [`Здравствуйте! ${name.trim() ? `Меня зовут ${name.trim()}. ` : ''}Пишу с сайта KODEN.`];
    lines.push(`Что нужно: ${k.label[0].toLowerCase() + k.label.slice(1)}.`);
    if (picked.length) lines.push(`Разделы: ${picked.join(', ').toLowerCase()}.`);
    lines.push(has.length ? `Уже есть: ${has.join(', ').toLowerCase()}.` : 'Логотипа, текстов и фото пока нет.');
    lines.push(`Срок: ${deadline.toLowerCase()}.`);
    if (likes.trim()) lines.push(`Нравятся сайты: ${likes.trim()}`);
    lines.push('Сколько это будет стоить и когда сможете начать?');
    return lines.join('\n');
  }, [k, picked, has, deadline, likes, name]);

  const copy = async (thenOpen) => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      ok = false;
    }
    setStatus(ok ? 'Текст скопирован. Вставьте его в чат.' : 'Не удалось скопировать автоматически: выделите текст заявки вручную.');
    if (thenOpen) window.open(telegram, '_blank', 'noopener');
  };

  return (
    <section id="brief" className="brief wrap" aria-labelledby="brief-h">
      <div className="brief-head">
        <h2 id="brief-h">Соберите заявку за минуту</h2>
        <p>С сайта сообщение никуда не отправляется: вы копируете его и пишете нам в Telegram сами.</p>
      </div>

      <div className="brief-grid">
        <form className="brief-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>Что нужно сделать</legend>
            <div className="chips">
              {kinds.map((x) => (
                <label key={x.id} className="chip">
                  <input type="radio" name="kind" checked={kind === x.id} onChange={() => setKind(x.id)} />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Какие разделы нужны</legend>
            <div className="chips">
              {sections.map((s) => (
                <label key={s} className="chip">
                  <input type="checkbox" checked={picked.includes(s)} onChange={() => setPicked(toggle(picked, s))} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Что у вас уже есть</legend>
            <div className="chips">
              {ready.map((s) => (
                <label key={s} className="chip">
                  <input type="checkbox" checked={has.includes(s)} onChange={() => setHas(toggle(has, s))} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Когда нужен сайт</legend>
            <div className="chips">
              {deadlines.map((d) => (
                <label key={d} className="chip">
                  <input type="radio" name="deadline" checked={deadline === d} onChange={() => setDeadline(d)} />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="brief-fields">
            <label>
              <span>Ссылки на сайты, которые нравятся</span>
              <input type="text" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="например, apple.com/ru" />
            </label>
            <label>
              <span>Как к вам обращаться</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
            </label>
          </div>
        </form>

        <div className="brief-out">
          <p className="brief-to">Сообщение для {telegramHandle}</p>
          <pre className="brief-msg" tabIndex={0}>{message}</pre>
          {k.example && (
            <p className="brief-example">
              Похожая работа: <a href={k.example[1]}>{k.example[0]}</a>
            </p>
          )}
          <div className="brief-actions">
            <button type="button" className="btn btn-mark" onClick={() => copy(true)}>
              Скопировать и открыть Telegram
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => copy(false)}>
              Только скопировать
            </button>
          </div>
          <p className="brief-status" role="status">{status}</p>
        </div>
      </div>
    </section>
  );
}
