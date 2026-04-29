// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Programinės įrangos kūrimo standartas [draft]',
  tagline: 'Vilniaus miesto savivaldybės programinės įrangos kūrimo, keitimo, diegimo ir priežiūros standartas [draft]',
  favicon: 'img/favicon.ico',

  url: 'https://vilnius-vmsa.github.io',
  baseUrl: '/dev-standard/', // uncomment this line when website will go public, and comment the line below
  // baseUrl: '/',

  organizationName: 'vilnius-vmsa',
  projectName: 'dev-standard',

  trailingSlash: false,
  onBrokenLinks: 'throw',

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
        title: 'VMS Dev Standartas [draft]',
        items: [
          {
            href: 'https://github.com/vilnius-vmsa/dev-standard',
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
