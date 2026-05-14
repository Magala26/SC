"use client"

import * as React from "react"
import { Clock2Icon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CalendarWithTimeProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedStartTime: string;
  onStartTimeChange: (time: string) => void;
  selectedEndTime: string;
  onEndTimeChange: (time: string) => void;
  minDate?: Date;
  maxDate?: Date;
  availableTimeSlots: string[];
}

export function CalendarWithTime({
  selectedDate,
  onDateChange,
  selectedStartTime,
  onStartTimeChange,
  selectedEndTime,
  onEndTimeChange,
  minDate,
  maxDate,
  availableTimeSlots,
}: CalendarWithTimeProps) {
  return (
    <Card size="sm" className="mx-auto w-full max-w-md">
      <CardContent className="flex justify-center p-0 py-4">
        <div className="w-full flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            className="p-0 mx-auto"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-card flex-col gap-4 p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <Select value={selectedStartTime} onValueChange={onStartTimeChange}>
              <SelectTrigger id="time-from" className="w-full border-2 border-foreground h-12 font-bold">
                <SelectValue placeholder="Select start time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={`start-${slot}`} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <Select value={selectedEndTime} onValueChange={onEndTimeChange}>
              <SelectTrigger id="time-to" className="w-full border-2 border-foreground h-12 font-bold">
                <SelectValue placeholder="Select end time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((slot) => (
                  <SelectItem key={`end-${slot}`} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  )
}
