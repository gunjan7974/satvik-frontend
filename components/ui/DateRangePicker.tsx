"use client"

import * as React from "react"
import { 
  format, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  startOfToday, 
  endOfToday, 
  startOfYesterday, 
  endOfYesterday, 
  startOfWeek, 
  endOfWeek, 
  startOfYear, 
  endOfYear,
  isSameDay
} from "date-fns"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Clock,
  CalendarDays,
  TrendingUp,
  Target,
  Sparkles,
  Zap,
  Flame
} from "lucide-react"
import { DayPicker, DropdownProps, useDayPicker, DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Input } from "./input"
import { Badge } from "./badge"
import { Separator } from "./separator"

// Custom Caption Component for Year and Month Selection
function CustomCaption(props: DropdownProps) {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker()
  const [year, setYear] = React.useState(props.displayMonth.getFullYear())
  const [month, setMonth] = React.useState(props.displayMonth.getMonth())

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10)
    if (!isNaN(newYear)) {
      setYear(newYear)
    }
  }

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value, 10)
    setMonth(newMonth)
  }

  const handleGo = () => {
    goToMonth(new Date(year, month))
  }

  React.useEffect(() => {
    setYear(props.displayMonth.getFullYear())
    setMonth(props.displayMonth.getMonth())
  }, [props.displayMonth])

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => previousMonth && goToMonth(previousMonth)}
          disabled={!previousMonth}
          className="h-8 w-8 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Select
              value={month.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-32 h-8 border-gray-200 bg-white hover:bg-gray-50">
                <SelectValue>
                  <span className="font-medium text-gray-900">
                    {months[month]}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {months.map((m, index) => (
                  <SelectItem 
                    key={m} 
                    value={index.toString()}
                    className="focus:bg-gray-100"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Input
              type="number"
              className="w-24 h-8 border-gray-200 bg-white"
              value={year}
              onChange={handleYearChange}
              min={1900}
              max={2100}
            />
          </div>
          
          <Button 
            onClick={handleGo} 
            size="sm"
            className="h-8 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
          >
            Go
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => nextMonth && goToMonth(nextMonth)}
          disabled={!nextMonth}
          className="h-8 w-8 rounded-lg hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-gray-500">
        {format(props.displayMonth, "MMM yyyy")}
      </div>
    </div>
  )
}

// Preset Button Component
interface PresetButtonProps {
  preset: {
    name: string
    label: string
    range: DateRange
    icon?: React.ElementType
  }
  isActive: boolean
  onClick: () => void
}

const PresetButton = ({ preset, isActive, onClick }: PresetButtonProps) => {
  const Icon = preset.icon || CalendarDays
  
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "w-full justify-start h-auto py-3 px-4 rounded-lg transition-all duration-200",
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700"
          : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          isActive 
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-500"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-left">
          <div className="font-medium text-sm">{preset.label}</div>
          {preset.range.from && preset.range.to && (
            <div className="text-xs opacity-70 mt-0.5">
              {format(preset.range.from, "MMM d")} - {format(preset.range.to, "MMM d")}
            </div>
          )}
        </div>
      </div>
    </Button>
  )
}

// Quick Select Component
interface QuickSelectProps {
  value: string
  onChange: (value: string) => void
}

const QuickSelect = ({ value, onChange }: QuickSelectProps) => {
  const options = [
    { value: "7", label: "Last 7 days" },
    { value: "14", label: "Last 14 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "180", label: "Last 6 months" },
    { value: "365", label: "Last year" }
  ]

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-9 border-gray-200 bg-white">
        <SelectValue placeholder="Quick select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Main DateRangePicker Component
interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  compact?: boolean
}

export default function DateRangePicker({
  className,
  date,
  onDateChange,
  compact = false
}: DateRangePickerProps) {
  const [quickSelectDays, setQuickSelectDays] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const presets = [
    {
      name: "today",
      label: "Today",
      range: {
        from: startOfToday(),
        to: endOfToday(),
      },
      icon: Sparkles
    },
    {
      name: "yesterday",
      label: "Yesterday",
      range: {
        from: startOfYesterday(),
        to: endOfYesterday(),
      },
      icon: Clock
    },
    {
      name: "thisWeek",
      label: "This Week",
      range: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
      icon: CalendarDays
    },
    {
      name: "last7days",
      label: "Last 7 Days",
      range: {
        from: subDays(new Date(), 6),
        to: new Date(),
      },
      icon: TrendingUp
    },
    {
      name: "thisMonth",
      label: "This Month",
      range: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
      icon: Target
    },
    {
      name: "thisYear",
      label: "This Year",
      range: {
        from: startOfYear(new Date()),
        to: endOfYear(new Date()),
      },
      icon: Flame
    },
  ]

  const handleDateSelect = (range: DateRange | undefined) => {
    onDateChange(range)
    setQuickSelectDays("")
  }

  const handlePresetSelect = (presetRange: DateRange) => {
    handleDateSelect(presetRange)
    setIsOpen(false)
  }

  const handleQuickSelect = (days: string) => {
    setQuickSelectDays(days)
    if (days) {
      const daysNum = parseInt(days, 10)
      handleDateSelect({
        from: subDays(new Date(), daysNum - 1),
        to: new Date()
      })
    }
  }

  const isPresetActive = (preset: typeof presets[0]) => {
    if (!date?.from || !date?.to || !preset.range.from || !preset.range.to) return false
    return isSameDay(date.from, preset.range.from) && isSameDay(date.to, preset.range.to)
  }

  const getDisplayText = () => {
    if (!date?.from) return "Select date range"
    
    if (date.to) {
      const fromText = format(date.from, "MMM d, yyyy")
      const toText = format(date.to, "MMM d, yyyy")
      
      if (isSameDay(date.from, date.to)) {
        return fromText
      }
      
      return `${fromText} - ${toText}`
    }
    
    return format(date.from, "MMM d, yyyy")
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-medium transition-all duration-200",
              compact ? "h-9 text-sm px-3" : "h-11 px-4",
              !date && "text-gray-400",
              "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300",
              "shadow-sm hover:shadow"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarIcon className={cn(
                "flex-shrink-0",
                compact ? "h-3.5 w-3.5" : "h-4 w-4"
              )} />
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className={cn(
              "ml-2 flex-shrink-0 transition-transform duration-200",
              compact ? "h-3.5 w-3.5" : "h-4 w-4",
              isOpen ? "rotate-180" : ""
            )} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[800px] p-0 rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          align="start"
        >
          <div className="flex">
            {/* Left Panel - Presets */}
            <div className="w-64 border-r border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Quick Select</h3>
                <p className="text-xs text-gray-500 mb-3">Choose from preset ranges</p>
                <QuickSelect 
                  value={quickSelectDays} 
                  onChange={handleQuickSelect} 
                />
              </div>
              
              <div className="p-4">
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <PresetButton
                      key={preset.name}
                      preset={preset}
                      isActive={isPresetActive(preset)}
                      onClick={() => handlePresetSelect(preset.range)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-4 pt-2">
                <div className="text-xs text-gray-400">
                  Selected: {date?.from && format(date.from, "MMM d, yyyy")}
                  {date?.to && ` → ${format(date.to, "MMM d, yyyy")}`}
                </div>
              </div>
            </div>

            {/* Right Panel - Calendar */}
            <div className="flex-1">
              <DayPicker
                mode="range"
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                showOutsideDays={true}
                className="p-3"
                classNames={{
                  months: "flex space-x-4",
                  month: "space-y-4",
                  caption: "relative hidden",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-lg"
                  ),
                  day_range_end: "day-range-end",
                  day_selected: cn(
                    "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:text-white focus:from-blue-700 focus:to-blue-600"
                  ),
                  day_today: "bg-gray-100 text-gray-900",
                  day_outside:
                    "day-outside text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                  day_hidden: "invisible",
                }}
                components={{
                  Caption: CustomCaption,
                }}
                modifiersClassNames={{
                  selected: "font-semibold",
                  today: "font-semibold"
                }}
              />
              
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {date?.from && date?.to ? (
                      <div className="flex items-center gap-2">
                        <span>Selected range:</span>
                        <Badge variant="secondary" className="font-medium">
                          {format(date.from, "MMM d")} - {format(date.to, "MMM d")}
                        </Badge>
                      </div>
                    ) : (
                      "Select a date range"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleDateSelect(undefined)
                        setIsOpen(false)
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}