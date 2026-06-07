import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalCrtOverlay } from "./components/fx/GlobalCrtOverlay";
import { SmoothScrollProvider } from "./components/fx/SmoothScrollProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://mogt.somaanransari.workers.dev"),
	title: {
		default: "MOGT — Web Apps, Systems & Digital Product Development",
		template: "%s — MOGT",
	},
	description:
		"MOGT designs and builds web apps, dashboards, SaaS platforms, marketplaces, and operational systems for teams that need clarity, speed, and scale.",
	applicationName: "MOGT",
	keywords: [
		"web app development",
		"product design agency",
		"SaaS platforms",
		"dashboards",
		"marketplaces",
		"operational systems",
		"UI/UX design",
		"full-stack development",
	],
	authors: [{ name: "MOGT" }],
	creator: "MOGT",
	openGraph: {
		type: "website",
		siteName: "MOGT",
		title: "MOGT — Web Apps, Systems & Digital Product Development",
		description:
			"We design and build web apps, dashboards, SaaS platforms, marketplaces, and operational systems for teams that need clarity before code and speed after launch.",
		url: "https://mogt.somaanransari.workers.dev",
	},
	twitter: {
		card: "summary_large_image",
		title: "MOGT — Web Apps, Systems & Digital Product Development",
		description:
			"We design and build web apps, dashboards, SaaS platforms, marketplaces, and operational systems for teams that need clarity, speed, and scale.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<SmoothScrollProvider>
					{children}
				</SmoothScrollProvider>
				<GlobalCrtOverlay />
			</body>
		</html>
	);
}
