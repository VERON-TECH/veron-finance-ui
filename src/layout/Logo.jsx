import veronLogo from "../assets/veron-finance-blanc.png"
export default function Logo({ position = "absolute top-8 left-1/2 transform -translate-x-1/2", className, size = " w-72" }) {
  return <div className={`${size} rounded-xl ${position} ${className}`}>
    <img src={veronLogo} alt="Logo application" className="rounded-xl" width="500px" />
  </div>
}