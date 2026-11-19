import { team } from '../data/team';

export default function Team() {
  return (
    <section id="team" className="team wrap" aria-labelledby="team-h">
      <h2 id="team-h">Команда</h2>
      <ul className="team-list">
        {team.map((m) => (
          <li key={m.name}>
            {m.photo && (
              <img src={`./images/team/${m.photo}`} alt={m.name} loading="lazy" width="96" height="96" />
            )}
            <span className="team-name">{m.name}</span>
            <span className="team-role">{m.role}</span>
            {m.telegram && (
              <a href={`https://t.me/${m.telegram}`} target="_blank" rel="noopener noreferrer">
                @{m.telegram}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
