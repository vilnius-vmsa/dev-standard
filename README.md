[Lietuvių](README.lt.md) | **English**

# Software Development Standard

The standard for software development, modification, deployment, and
maintenance of Vilnius City Municipality.

[![Latest release](https://img.shields.io/github/v/release/vilnius-vmsa/dev-standard?display_name=tag&sort=semver&label=release)](https://github.com/vilnius-vmsa/dev-standard/releases/latest)
[![Tests](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/ci.lint-validate.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/ci.lint-validate.yml)
[![Deployment](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/cd.deploy.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/cd.deploy.yml)
[![CodeQL](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/codeql.yml/badge.svg)](https://github.com/vilnius-vmsa/dev-standard/actions/workflows/codeql.yml)
[![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: CC BY 4.0](https://img.shields.io/badge/license-CC_BY_4.0-2b5797?logo=creativecommons&logoColor=white)](LICENSE)

## Navigation

- [Published standard website](https://vilnius-vmsa.github.io/dev-standard/)
- [Download the latest PDF](https://github.com/vilnius-vmsa/dev-standard/releases/latest/download/dev-standard.pdf)
- **[→ Quick start](docs/00-greitas-startas.md)** – start here
- [Contents](docs/index.md) – the complete standard
- [Changelog](changelog.md) – version history

## Who it applies to

- Internal municipal teams
- Municipal institutions
- External suppliers engaged through public procurement

For details, see [Chapter 2 – Purpose and scope of the standard](docs/02-paskirtis-ir-taikymo-sritis.md).

## Version

[![Latest release](https://img.shields.io/github/v/release/vilnius-vmsa/dev-standard?display_name=tag&sort=semver&label=release)](https://github.com/vilnius-vmsa/dev-standard/releases/latest)
[![Release date](https://img.shields.io/github/release-date/vilnius-vmsa/dev-standard?label=released)](https://github.com/vilnius-vmsa/dev-standard/releases/latest)

## Running locally

Node.js 20 or later is required.

```bash
npm ci
npm run build
```

Run the dependency security check used by CI:

```bash
npm audit --audit-level=high
```

The command fails if it finds vulnerabilities with a `high` or `critical`
severity level.

## CI/CD and releases

A pull request targeting the `main` branch automatically runs a dependency
security audit and verifies that the Docusaurus website builds successfully.

To publish a new version:

1. Merge the planned changes into the `main` branch.
2. Open **Actions** on GitHub and run the **CI: Create release tag** workflow.
3. Enter a tag consisting of `v` and three numbers, such as `v1.2.3`, and
   briefly explain why the version is being released.
4. The workflow validates the tag, creates a GitHub Release, and automatically
   generates a summary from Git commits and merged pull requests.
5. The release workflow builds a publicly downloadable PDF and attaches it to
   the GitHub Release.
6. **CD: Deploy to GitHub Pages** builds the tagged version and publishes the
   website to GitHub Pages.

A release is also created automatically when a correctly formatted Git tag,
such as `v1.2.3`, is pushed to GitHub. Tags containing letters, extra segments,
or pre-release suffixes are not accepted.

To redeploy an existing published version, manually run
**CD: Deploy to GitHub Pages** and provide its tag.

GitHub Release notes are generated according to
[`.github/release.yml`](.github/release.yml). The
[`changelog.md`](changelog.md) file remains the long-term, manually maintained
version history.

## License

[![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This material is distributed under the
[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE) license.

## Contact

[Innovation and Technology Group](https://vilnius.lt/struktura-ir-kontaktai/inovaciju-ir-technologiju-grupe), Vilnius City Municipal Administration
