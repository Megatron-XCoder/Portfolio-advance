import { CalendarIcon, BookOpen } from "lucide-react"

interface EducationCardProps {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description?: string
  achievements?: string[]
}

export function EducationCard({
  institution,
  degree,
  field,
  startDate,
  endDate,
  description,
  achievements,
}: EducationCardProps) {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-button terminal-button-red"></div>
        <div className="terminal-button terminal-button-yellow"></div>
        <div className="terminal-button terminal-button-green"></div>
        <div className="terminal-title">{institution}.edu</div>
      </div>
      <div className="terminal-content">
        <p className="mb-1">
          <span className="text-primary">$</span> cat education_details.txt
        </p>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-primary" />
            <h3 className="font-bold">
              {degree} in {field}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CalendarIcon size={14} />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          {description && <p className="text-sm mb-3">{description}</p>}
          {achievements && achievements.length > 0 && (
            <div className="space-y-1">
              <p className="text-primary text-sm">Achievements:</p>
              <ul className="space-y-1">
                {achievements.map((achievement, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-primary mr-2">-</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
