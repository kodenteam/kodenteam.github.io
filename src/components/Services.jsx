const services = [
  {
    title: 'Сайт компании или бренда',
    text: 'Одна страница или несколько разделов: о компании, услуги, галерея, контакты. Вёрстка под телефон и компьютер.',
    examples: [['Екатерина Костенко', '#kostenko'], ['MaryJoy', '#maryjoy'], ['Крассети', '#krasseti']],
  },
  {
    title: 'Спецпроект или лонгрид',
    text: 'История человека, компании или темы: хронология, цифры, цитаты, ссылки на источники.',
    examples: [['Высота', '#vysota'], ['Nike', '#nike'], ['Илон Маск', '#musk'], ['Марк Цукерберг', '#zuckerberg']],
  },
  {
    title: 'Сайт вместе с Telegram-ботом',
    text: 'Бот на Python работает с теми же данными, что и сайт. Кнопки на сайте открывают нужный раздел бота одной ссылкой.',
    examples: [['World of Inventions', '#world']],
  },
];

export default function Services() {
  return (
    <section id="services" className="services wrap" aria-labelledby="services-h">
      <h2 id="services-h">Что можно заказать</h2>
      <dl className="service-list">
        {services.map((s) => (
          <div className="service" key={s.title}>
            <dt>{s.title}</dt>
            <dd>
              <p>{s.text}</p>
              <p className="service-ex">
                {s.examples.length > 1 ? 'Примеры: ' : 'Пример: '}
                {s.examples.map(([t, h], i) => (
                  <span key={h}>
                    {i > 0 && ', '}
                    <a href={h}>{t}</a>
                  </span>
                ))}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
