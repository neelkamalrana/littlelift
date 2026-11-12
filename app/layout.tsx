import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Little Lift — A little help. A lighter day.',referrer:'no-referrer',description:'Share a bill or give someone a little lift. Pay recipients directly through PayPal.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
