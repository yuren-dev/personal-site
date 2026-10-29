import ShaderBackground from './ShaderBackground'

const SOCIALS = [
  {
    label: 'X',
    href: 'https://x.com/yuren_dev',
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/yuren-dev',
    icon: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:contact@yuren.dev',
    icon: (
      <path
        d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Zm2 0 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

const PROJECTS = [
  {
    name: 'SessionTail',
    tag: 'sessiontail.com',
    desc: 'Agent session community for Codex and Claude Code: keep the whole session, not just the final code, with redaction on your device.',
    href: 'https://sessiontail.com/',
    mark: 'S',
  },
  {
    name: 'afk-vibe-flow',
    tag: 'github.com/yuren-dev/afk-vibe-flow',
    desc: 'An issue-driven Loop Engineering plugin for Codex that brings structured workflows, isolated execution, and auditable software delivery to vibe coding.',
    href: 'https://github.com/yuren-dev/afk-vibe-flow',
    mark: 'A',
  },
]

export default function App() {
  return (
    <div className="page">
      <ShaderBackground />
      <main className="column">
        <header className="hero">
          <img
            className="avatar"
            src="https://github.com/yuren-dev.png"
            alt="Yuren"
            width="72"
            height="72"
          />
          <div>
            <h1>Yuren</h1>
            <p className="subtitle">Building tools for AI coding agents</p>
          </div>
        </header>

        <p className="intro">
          I build tools for working with AI coding agents — keeping the messy
          process, not just the final diff. Currently building{' '}
          <a href="https://sessiontail.com/">SessionTail</a>, where agent
          sessions can be read, carried across devices, and continued from the
          middle, and{' '}
          <a href="https://github.com/yuren-dev/afk-vibe-flow">
            afk-vibe-flow
          </a>
          , an issue-driven plugin that turns a brief into auditable,
          loop-driven delivery with Codex.
        </p>

        <p className="intro">
          You can reach me at{' '}
          <a href="https://x.com/yuren_dev">@yuren_dev</a> and via{' '}
          <a href="mailto:contact@yuren.dev">email</a>. You can see some of my
          code on <a href="https://github.com/yuren-dev">GitHub</a>.
        </p>

        <nav className="socials" aria-label="Social links">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              title={s.label}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                {s.icon}
              </svg>
            </a>
          ))}
        </nav>

        <section>
          <h2>Projects</h2>
          <ul className="projects">
            {PROJECTS.map((p) => (
              <li key={p.name}>
                <a href={p.href} target="_blank" rel="noreferrer">
                  <span className="project-mark" aria-hidden="true">
                    {p.mark}
                  </span>
                  <span className="project-text">
                    <span className="project-name">{p.name}</span>
                    <span className="project-desc">{p.desc}</span>
                    <span className="project-tag">{p.tag}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer>
          <span>© {new Date().getFullYear()} Yuren</span>
          <span className="footer-credit">
            Background inspired by nasana’s glowingMarblingBlack
          </span>
        </footer>
      </main>
    </div>
  )
}
