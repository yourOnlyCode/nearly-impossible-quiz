import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  onSelect?: () => void // Callback when a date is selected
  className?: string
}

export function Calendar({ value, onChange, onSelect, className }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date()
  )

  const today = new Date()
  const selectedDate = value

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    onChange?.(date)
    onSelect?.() // Call onSelect callback to close popover
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-7 w-7 text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-sm text-white">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-7 w-7 text-white hover:bg-white/20"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-xs font-medium text-center text-white/70 py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            type="button"
            onClick={() => day && handleDayClick(day)}
            disabled={!day}
            className={cn(
              "h-9 w-9 text-sm rounded-md transition-colors",
              !day && "cursor-default",
              day && "hover:bg-white/20 hover:text-white text-white/80",
              isToday(day || 0) && "bg-blue-500/30 text-blue-200 font-semibold ring-2 ring-blue-400/50",
              isSelected(day || 0) && "bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
