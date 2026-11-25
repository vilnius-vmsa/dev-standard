// @ts-check
import { readSiteVersions } from './scripts/versions/lib/site-versions.mjs';

const REPO_URL = 'https://github.com/vilnius-vmsa/dev-standard';

// Earlier releases for the version dropdown, written by `npm run versions:snapshot` (deploy and CI).
// Without it the site builds docs/ only and has no dropdown.
const docsVersions = readSiteVersions();
const hasEarlierVersions = Boolean(docsVersions?.versions.length);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Programinės įrangos kūrimo standartas',
  tagline: 'Vilniaus miesto savivaldybės programinės įrangos kūrimo, keitimo, diegimo ir priežiūros standartas',
  favicon: 'img/favicon.ico',

  url: 'https://vilnius-vmsa.github.io',
  baseUrl: '/dev-standard/', // uncomment this line when website will go public, and comment the line below
  // baseUrl: '/',

  organizationName: 'vilnius-vmsa',
  projectName: 'dev-standard',

  trailingSlash: false,
  onBrokenLinks: 'throw',
  // Releases published in the version dropdown pass this too (see EARLIEST_PUBLISHED in scripts/versions/lib/select.mjs).
  onBrokenAnchors: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'lt',
    locales: ['lt'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Earlier versions are copies of released tags, so only docs/ gets an edit link.
          editUrl: ({ version, versionDocsDirPath, docPath }) =>
            version === 'current' ? `${REPO_URL}/edit/main/${versionDocsDirPath}/${docPath}` : undefined,
          // docs/ is the release being built, so it is served at the root; earlier versions under /<major.minor>/.
          lastVersion: 'current',
          ...(docsVersions && {
            versions: {
              // Without a release tag (CI, local builds) docs/ holds unreleased changes.
              current: { label: docsVersions.current ?? 'Neišleista' },
              ...Object.fromEntries(docsVersions.versions.map(({ name, line }) => [name, { path: line }])),
            },
          }),
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'VMS DEV Standartas',
        logo: {
          alt: 'Vilniaus miesto savivaldybės logotipas',
          src: 'logo.svg',
        },
        items: [
          ...(hasEarlierVersions ? [{ type: 'docsVersionDropdown', position: 'right' }] : []),
          {
            href: REPO_URL,
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Vilniaus miesto savivaldybė © ${new Date().getFullYear()}`,
      },
    }),
};

export default config;
