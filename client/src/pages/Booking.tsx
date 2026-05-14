import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

const BOOKING_INTERVAL_MINUTES = 30;

// Strict booking rules
const BOOKING_RULES = {
  closedDays: [0], // 0 = Sunday
  saturdayHours: { open: 9, close: 15.5 }, // 9:00 - 3:30 PM
  weekdayHours: { open: 9, close: 17 }, // 9:00 - 5:00 PM
};

// Hardcoded services
const SERVICES = [
  { id: 1, name: 'Standard Clean', price: 10000 }, // R100
  { id: 2, name: 'The 95 Deluxe', price: 22000 }, // R220
  { id: 3, name: 'Deep Clean', price: 12000 }, // R120
  { id: 4, name: 'Intense Deep Clean', price: 24000 }, // R240
  { id: 5, name: 'Suede/Nubuck Maintenance & Clean', price: 20000 }, // R200
  { id: 6, name: 'Sole Whitening', price: 15000 }, // R150
  { id: 7, name: 'Sneaker Customizations', price: 30000 }, // R300
  { id: 8, name: 'Colour Restoration', price: 25000 }, // R250
  { id: 9, name: 'Sneaker Protection', price: 18000 }, // R180
  { id: 10, name: 'Nano Coating', price: 28000 }, // R280
];

export default function Booking() {
  const createBooking = trpc.sneaker.bookings.create.useMutation();

  const [formData, setFormData] = useState({
    selectedService: '' as string,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    callType: 'incall' as 'incall' | 'outcall',
    specialRequests: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate available time slots based on strict booking rules
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const dayOfWeek = selectedDate.getDay();
    
    // Check if closed (Sunday)
    if (BOOKING_RULES.closedDays.includes(dayOfWeek)) return [];

    // Determine hours based on day
    let openHour: number, closeHour: number;
    if (dayOfWeek === 6) { // Saturday
      openHour = BOOKING_RULES.saturdayHours.open;
      closeHour = Math.floor(BOOKING_RULES.saturdayHours.close);
    } else { // Monday-Friday
      openHour = BOOKING_RULES.weekdayHours.open;
      closeHour = BOOKING_RULES.weekdayHours.close;
    }

    const slots = [];
    let currentHour = openHour;
    let currentMin = 0;
    const closeTimeInMinutes = closeHour * 60;

    while (currentHour * 60 + currentMin < closeTimeInMinutes) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      currentMin += BOOKING_INTERVAL_MINUTES;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }

    return slots;
  }, [selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setFormData({ ...formData, bookingDate: dateStr, bookingTime: '' });
    }
  };

  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    setFormData({ ...formData, bookingTime: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (value: string) => {
    setFormData({ ...formData, selectedService: value });
  };

  const handleCallTypeChange = (value: string) => {
    setFormData({ ...formData, callType: value as 'incall' | 'outcall' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.selectedService) {
      toast.error('Please select a service');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.bookingDate || !formData.bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate booking date is at least 1 day in advance
    const bookingDate = new Date(formData.bookingDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < tomorrow) {
      toast.error('Bookings must be made at least 1 day in advance');
      return;
    }

    // Validate day is not Sunday
    const dayOfWeek = bookingDate.getDay();
    if (BOOKING_RULES.closedDays.includes(dayOfWeek)) {
      toast.error('We are closed on Sundays');
      return;
    }

    try {
      const serviceId = Number(formData.selectedService);
      const service = SERVICES.find(s => s.id === serviceId);
      
      if (!service) {
        toast.error('Selected service not found');
        return;
      }

      const result = await createBooking.mutateAsync({
        serviceId: serviceId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        specialRequests: `${formData.callType.toUpperCase()} BOOKING. ${formData.specialRequests || ''}`,
      });

      toast.success('Booking created successfully! Redirecting to checkout...');
      
      // Construct WhatsApp message for the user to send as well
      const whatsappMsg = `Hi Sneaker Care Department, I've just made a booking!\n\nService: ${service.name}\nDate: ${formData.bookingDate}\nTime: ${formData.bookingTime}\nType: ${formData.callType.toUpperCase()}\nName: ${formData.customerName}`;
      const whatsappUrl = `https://wa.me/27665884466?text=${encodeURIComponent(whatsappMsg)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        window.location.href = `/checkout?bookingIds=${result.bookingId}`;
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Calculate max date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Book Your Service</h1>
          <p className="text-lg">Schedule your sneaker care appointment in just a few steps.</p>
        </div>
      </section>

      <div className="red-divider" />

      <section className="bg-background py-16 md:py-24">
        <div className="container max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Select Service *</label>
              <Select value={formData.selectedService} onValueChange={handleServiceChange}>
                <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold text-foreground bg-white">
                  <SelectValue placeholder="-- Choose a service --" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICES.map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name} - R {(service.price / 100).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Booking Type Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Booking Type *</label>
              <Select value={formData.callType} onValueChange={handleCallTypeChange}>
                <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold text-foreground bg-white">
                  <SelectValue placeholder="Select booking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incall">In-call (At our studio)</SelectItem>
                  <SelectItem value="outcall">Out-call (We come to you)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calendar Selection */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Select Date *</label>
              <div className="card-modern p-4 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => {
                    // Disable Sundays
                    if (date.getDay() === 0) return true;
                    // Disable dates before tomorrow
                    if (date < tomorrow) return true;
                    // Disable dates more than 30 days away
                    if (date > maxDate) return true;
                    return false;
                  }}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block font-bold uppercase mb-3 text-foreground">Select Time *</label>
                <Select value={selectedTime} onValueChange={handleTimeChange}>
                  <SelectTrigger className="w-full border-2 border-foreground h-12 font-bold text-foreground bg-white">
                    <SelectValue placeholder="-- Choose a time --" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>
                        No available times
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Customer Information */}
            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Full Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Your full name"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Email *</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+27 (123) 456-7890"
                className="w-full border-2 border-foreground bg-background p-3 font-bold rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-bold uppercase mb-3 text-foreground">Special Requests</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special instructions or concerns?"
                className="w-full border-2 border-foreground bg-background p-3 min-h-24 font-bold rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createBooking.isPending}
              className="btn-primary w-full font-bold uppercase disabled:opacity-50"
            >
              {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
