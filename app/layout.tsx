import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({ src: "./fonts/SpaceGrotesk.ttf", variable: "--font-space-grotesk", display: "swap", weight: "300 700" });
const inter = localFont({ src: "./fonts/Inter.ttf", variable: "--font-inter", display: "swap", weight: "100 900" });
const jetbrains = localFont({ src: "./fonts/JetBrainsMono.ttf", variable: "--font-jetbrains", display: "swap", weight: "100 800" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.noblesoft.com"),
  title: {
    default: "Noblesoft Technologies — Enterprise Application Consulting",
    template: "%s · Noblesoft Technologies",
  },
  description: "Noblesoft is an Inc. 500 enterprise application partner delivering Salesforce, SAP, Oracle, Infor, and Workday transformations across the US, Mexico, and India.",
  keywords: ["Noblesoft","Enterprise Applications","Salesforce","SAP","Oracle","Infor","Workday","MuleSoft","ERP","CRM","HCM","Digital Transformation"],
  openGraph: { title: "Noblesoft Technologies — Enterprise Application Consulting", description: "Inc. 500 enterprise application partner for Salesforce, SAP, Oracle, Infor, and Workday.", type: "website" },
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
