interface SkillProgressProps {
  name: string
  percentage: number
}

export function SkillProgress({ name, percentage }: SkillProgressProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-primary">{percentage}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}
