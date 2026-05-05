export default function PhoneInput({ value, onChange, id, required }) {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:border-green-500">
      <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">+91</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
        className="flex-1 px-3 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
        placeholder="Enter 10 digit mobile number"
        required={required}
      />
    </div>
  )
}
