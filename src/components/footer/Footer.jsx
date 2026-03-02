export default function Footer({ font = "bg-sky-50 text-sky-950 font-medium" }) {
  return <footer className={`fixed bottom-0 ${font} w-full h-1/25`}>
    <p className="text-center p-1">© VERON-FINANCE v2.0.0-beta.1 - POWERED BY VERON-TECH</p>
  </footer>
}