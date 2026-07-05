const COLORS = [
  '#6D28D9', '#DC2626', '#10B981', '#94A3B8',
  '#EC4899', '#171717', '#0EA5E9', '#16A34A',
  '#FCA5A5', '#2563EB', '#A3E635', '#F97316',
  '#A78BFA', '#0D9488', '#BE185D', '#EAB308',
]

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-3 justify-items-center">
      {COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            borderColor: color,
            backgroundColor: value === color ? color : 'transparent',
          }}
        />
      ))}
    </div>
  )
}
