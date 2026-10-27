import './globals.css';
export const viewport={width:'device-width',initialScale:1};
export const metadata={title:'Ahorcado! • Juega en vivo',description:'Crea una sala, elige tu avatar y juega al ahorcado con tus amigos.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
