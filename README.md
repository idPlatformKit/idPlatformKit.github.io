# IdPlatformKit website

Source of **https://idplatformkit.github.io**: what [IdPlatformKit](https://github.com/idPlatformKit) is, how it's built, how to run it, and recorded demos.

Built with [Astro Starlight](https://starlight.astro.build), deployed to GitHub Pages by `.github/workflows/deploy.yaml` on every push to `main`. Pull requests only build.

## Develop

Requires Node.js 22.23.4 or later (Astro 7).

```sh
npm ci
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Layout

```
src/content/docs/        # pages (Markdown/MDX), one file per page
src/components/          # the home page hero and flow
src/styles/theme.css     # colours and fonts
demos/*.tape             # VHS scripts that record the terminal demos
public/demos/            # the recordings they produce
```

## Content rules

- Pages tell what was run and observed, wrong first attempts included. The reference docs stay in each repository (`Orchestrator/docs/`, the portal README); pages here link to them rather than copying them.
- A feature is presented as done only once it's implemented and tested end to end.
- Demos are scripted, so they can be re-recorded when the platform changes. See the header of each `demos/*.tape`.

## License

[Apache 2.0](LICENSE)
