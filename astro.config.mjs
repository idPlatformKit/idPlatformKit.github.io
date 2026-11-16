// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
	site: 'https://idplatformkit.github.io',
	integrations: [
		// Before starlight: it renders ```mermaid blocks in the docs.
		mermaid({ theme: 'neutral', autoTheme: true }),
		starlight({
			title: 'IdPlatformKit',
			description:
				'A reference Internal Developer Platform you can run on your laptop: Backstage, Argo CD, Crossplane v2, OpenBao, Envoy Gateway.',
			logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', replacesTitle: false },
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/idPlatformKit' },
			],
			editLink: {
				baseUrl: 'https://github.com/idPlatformKit/idPlatformKit.github.io/edit/main/',
			},
			components: {
				// Home page hero: the claim and what it becomes.
				Hero: './src/components/Hero.astro',
			},
			customCss: [
				'@fontsource-variable/schibsted-grotesk',
				'@fontsource-variable/jetbrains-mono',
				'./src/styles/theme.css',
			],
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'What IdPlatformKit is', slug: 'start/what-is-idpk' },
						{ label: 'Install it on your laptop', slug: 'start/run-locally' },
					],
				},
				{
					label: 'Architecture',
					items: [
						{ label: 'Overview', slug: 'architecture/overview' },
						{ label: 'Tenant', slug: 'architecture/tenant' },
						{ label: 'PostgresDatabase', slug: 'architecture/postgres-database' },
						{ label: 'GitOps with Argo CD', slug: 'architecture/gitops' },
						{ label: 'HTTPS on kind', slug: 'architecture/https' },
						{ label: 'Single sign-on', slug: 'architecture/sso' },
						{ label: 'Who can do what', slug: 'architecture/access' },
						{ label: 'Design decisions', slug: 'architecture/decisions' },
					],
				},
				{
					label: 'Demos',
					items: [{ label: 'A tenant in seconds', slug: 'demos/tenant' }],
				},
				{ label: 'Roadmap', slug: 'roadmap' },
				{ label: 'Writing', slug: 'writing' },
			],
		}),
	],
});
