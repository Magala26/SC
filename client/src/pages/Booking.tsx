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
import { Checkbox } from "@/components/ui/checkbox";
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
  const sendBookingWebhook = trpc.sneaker.bookings.sendWebhook.useMutation();

  const [formData, setFormData] = useState({
    selectedServices: [] as string[],
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
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const selectedServices = useMemo(() => {
    return SERVICES.filter((service) => formData.selectedServices.includes(String(service.id)));
  }, [formData.selectedServices]);

  const selectedServicesTotal = useMemo(() => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  }, [selectedServices]);

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

  const handleServiceToggle = (serviceId: string) => {
    setFormData((current) => {
      const isSelected = current.selectedServices.includes(serviceId);
      return {
        ...current,
        selectedServices: isSelected
          ? current.selectedServices.filter((id) => id !== serviceId)
          : [...current.selectedServices, serviceId],
      };
    });
  };

  const handleCallTypeChange = (value: string) => {
    setFormData({ ...formData, callType: value as 'incall' | 'outcall' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service');
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
      const selectedServiceNames = selectedServices.map((service) => service.name).join(', ');
      const specialRequests = `${formData.callType.toUpperCase()} BOOKING. SERVICES SELECTED: ${selectedServiceNames}. ${formData.specialRequests || ''}`.trim();
      const bookingIds: number[] = [];

      for (const service of selectedServices) {
        const result = await createBooking.mutateAsync({
          serviceId: service.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          specialRequests,
        });

        bookingIds.push(result.bookingId);
      }

      await sendBookingWebhook.mutateAsync({
        bookingIds,
        services: selectedServices,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        callType: formData.callType,
        specialRequests: formData.specialRequests,
        totalAmount: selectedServicesTotal,
      });

      setShowThankYouPopup(true);
      toast.success('Thank you, your booking went through!');
      
      // Construct WhatsApp message for the user to send as well
      const whatsappMsg = `Hi Sneaker Care Department, I've just made a booking!\n\nServices: ${selectedServiceNames}\nDate: ${formData.bookingDate}\nTime: ${formData.bookingTime}\nType: ${formData.callType.toUpperCase()}\nName: ${formData.customerName}`;
      const whatsappUrl = `https://wa.me/27665884466?text=${encodeURIComponent(whatsappMsg)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        window.location.href = `/checkout?bookingIds=${bookingIds.join(',')}`;
      }, 2200);
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

  const isSubmitting = createBooking.isPending || sendBookingWebhook.isPending;

  return (
    <Layout>
      {showThankYouPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card-modern max-w-md w-full bg-white text-center p-8 shadow-2xl border-2 border-blue-100">
            <div className="text-6xl text-accent mb-4" aria-hidden="true">♥</div>
            <h2 className="text-3xl font-bold uppercase text-foreground mb-3">Thank You</h2>
            <p className="text-lg font-semibold text-gray-700">Your booking went through.</p>
          </div>
        </div>
      )}

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
              <label className="block font-bold uppercase mb-3 text-foreground">Select Services *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SERVICES.map((service) => {
                  const serviceId = String(service.id);
                  const isSelected = formData.selectedServices.includes(serviceId);

                  return (
                    <div
                      key={service.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleServiceToggle(serviceId)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleServiceToggle(serviceId);
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-3 text-left border-2 rounded-lg p-4 transition-all bg-white ${
                        isSelected ? 'border-accent shadow-md' : 'border-foreground hover:border-accent'
                      }`}
                    >
                      <Checkbox checked={isSelected} className="pointer-events-none" />
                      <span className="flex-1">
                        <span className="block font-bold text-foreground">{service.name}</span>
                        <span className="block text-sm font-semibold text-gray-500">R {(service.price / 100).toFixed(2)}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
              {selectedServices.length > 0 && (
                <div className="mt-4 rounded-lg bg-blue-50 p-4 font-bold text-foreground">
                  Selected: {selectedServices.map((service) => service.name).join(', ')}
                  <span className="block text-accent mt-1">Total: R {(selectedServicesTotal / 100).toFixed(2)}</span>
                </div>
              )}
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
              disabled={isSubmitting}
              className="btn-primary w-full font-bold uppercase disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
