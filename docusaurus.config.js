// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Programinės įrangos kūrimo standartas',
  tagline: 'Vilniaus miesto savivaldybės programinės įrangos kūrimo, keitimo, diegimo ir priežiūros standartas',
  favicon: 'img/favicon.ico',

  url: 'https://vilnius-vmsa.github.io',
  baseUrl: '/dev-standard/',

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
        title: 'VMS Dev Standartas',
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
