export default function Input({ id, label, type, name, placeholder, className, bg, error, ...props }) {
  return <div className="flex flex-col mb-2">
    <div className="mb-2 flex">
      <label htmlFor={id} className="w-28 text-sky-950">{label}</label>
      <input type={type} name={name} placeholder={placeholder} id={id} className={`text-sky-950 rounded p-1 w-48 ${className}`} {...props} />
    </div>
    <div className="flex justify-end text-red-500">{error}</div>
  </div>
}