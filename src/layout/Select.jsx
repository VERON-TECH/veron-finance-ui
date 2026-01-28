export default function Select({ label, selectedTitle, data, id, name, ref, ...props }) {
  return <div className="flex justify-between gap-2">
    <div className="flex flex-col mb-2">
      <div className="mb-2 flex">
        <label htmlFor={id} className="w-28 text-sky-950">{label}</label>
        <select
          name={name}
          id={id}
          className="text-sky-950 rounded p-1 w-48 border border-sky-950"
          defaultValue={selectedTitle}
          ref={ref}
          {...props}
        >
          <option disabled>{selectedTitle}</option>
          {data.map(d => (
            <option key={d.key} value={d.value}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
}