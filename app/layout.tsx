import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Not preloaded. The theme reads these variables on `:root`, but they are set
   on `<body>`, so they resolve to nothing and every page renders in the system
   font. Preloading still fetched all three files, about 670 KB, at the front
   of every first visit for text that never used them. Without the preload a
   browser only fetches a font that something on the page is set in. */
const spaceGrotesk = localFont({ src: "./fonts/SpaceGrotesk.ttf", variable: "--font-space-grotesk", display: "swap", weight: "300 700", preload: false });
const inter = localFont({ src: "./fonts/Inter.ttf", variable: "--font-inter", display: "swap", weight: "100 900", preload: false });
const jetbrains = localFont({ src: "./fonts/JetBrainsMono.ttf", variable: "--font-jetbrains", display: "swap", weight: "100 800", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.testsoft.com"),
  title: {
    default: "Testsoft Technologies — Enterprise Application Consulting",
    template: "%s · Testsoft Technologies",
  },
  description: "Testsoft is an Inc. 500 enterprise application partner delivering Salesforce, SAP, Oracle, Infor, and Workday transformations across the US, Mexico, and India.",
  keywords: ["Testsoft","Enterprise Applications","Salesforce","SAP","Oracle","Infor","Workday","MuleSoft","ERP","CRM","HCM","Digital Transformation"],
  openGraph: { title: "Testsoft Technologies — Enterprise Application Consulting", description: "Inc. 500 enterprise application partner for Salesforce, SAP, Oracle, Infor, and Workday.", type: "website" },
};

const themeScript = `(function(){try{
  var t = localStorage.getItem('ns-theme');
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} grain`}>
        {children}
      </body>
    </html>
  );
}
