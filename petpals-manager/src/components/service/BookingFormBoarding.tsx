
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Clock, User, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { BoardingService } from '@/types/service';
import { Pet } from '@/types/pets';
import { getPets } from '@/service/pet';
import { getTokenFromCookies } from '@/service/auth';
import { fetchRegisterBaording } from '@/service/boarding';


// Form schema
interface BookingFormValues {
  id: string;
  start_date: Date;
  end_date: Date;
  note: string;
}


type BookingFormProps = {
  service: BoardingService;
  onSuccess: () => void;
};

const BookingFormBoarding = ({ service, onSuccess }: BookingFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const token = getTokenFromCookies();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const form = useForm<BookingFormValues>({
    defaultValues: {
      id: "",
      start_date: new Date,
      end_date: new Date,
      note: "",
    },
  });

  async function onSubmit(values: BookingFormValues) {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    console.log("Form values before submission:", values);
    try {
      setLoading(true);
      // Gửi dữ liệu lên backend để đặt lịch dịch vụ
      const response = await fetchRegisterBaording(token, {
        petId: Number(values.id), // Chuyển id thành số nếu cần
        boardingId: service.id,
        start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
        notes: values.note,
      });

      if (response) {
        toast.success("Boarding booked successfully!", {
          description: `Your appointment for ${service.name} has been confirmed.`,
        });

        onSuccess();

        navigate("/boardings/me");
      } else {
        toast.error("Booking failed", {
          description: response.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error booking service:", error);
      toast.error("Booking failed", {
        description: "Please try again later.",
      });
    }
    // In a real app, this would send data to your backend
    console.log('Booking submitted:', { service, ...values });

    // Show success notification
    toast.success('Boarding booked successfully!', {
      description: `Your appointment for ${service.name} has been confirmed.`,
    });

    onSuccess();
    setLoading(false)
    // Navigate to appointments page
    navigate('/boardings/me');
  }

  const selectedPet = form.watch('id')
    ? pets.find(pet => pet.id === Number(form.watch('id')))
    : null;
  useEffect(() => {
    async function fetchPets() {
      if (!token) return;
      const data = await getPets(token);

      const formattedPets: Pet[] = data.map(pet => ({
        ...pet,
        id: Number(pet.id), // Đảm bảo id là số
        name: pet.name,
        image: pet.image || null, // Đảm bảo image có thể là null
      }));

      setPets(formattedPets);
    }

    fetchPets();
  }, [token]);
  const startDate = form.watch("start_date");
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            1
          </div>
          <div className={cn(
            "h-1 w-12",
            step >= 2 ? "bg-primary" : "bg-muted"
          )} />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            2
          </div>
          <div className={cn(
            "h-1 w-12",
            step >= 3 ? "bg-primary" : "bg-muted"
          )} />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            3
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium">Select a Pet</h3>

              {pets.length === 0 ? (
                <div className="text-center p-6 border rounded-lg">
                  <p className="mb-4 text-gray-600 dark:text-gray-400">You don't have any pets registered.</p>
                  <Button
                    onClick={() => navigate('/pets/add')}
                    variant="outline"
                  >
                    Register a Pet First
                  </Button>
                </div>
              ) : (
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pets.map((pet, index) => (
                            <SelectItem key={index} value={String(pet.id)}>
                              <div className="flex items-center">
                                <span>{pet.name}</span>
                                <span className="text-gray-500 ml-2 text-xs">({pet.type})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/services')}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const isValid = form.trigger('id');
                    if (isValid) setStep(2);
                  }}
                  disabled={!form.watch("id")} // Disable nếu pet chưa được chọn
                >
                  Next
                </Button>

              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium">Select Date & Time</h3>

              <div className="grid gap-6">
             

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date();
                              const twoMonthsLater = new Date();
                              twoMonthsLater.setMonth(today.getMonth() + 2);
                              return (
                                date < today || // Không chọn ngày trong quá khứ
                                date > twoMonthsLater || // Không chọn ngày sau 2 tháng
                                (startDate && date <= startDate) // Ngăn chọn ngày cùng hoặc trước start_date
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any important notes (e.g. allergies, behavior)..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    const isEndDateValid = await form.trigger('end_date');
                    const isStartDateValid = await form.trigger('start_date');
                    if (isEndDateValid && isStartDateValid) {
                      setStep(3);
                    }
                  }}
                  disabled={!form.watch('end_date') || !form.watch('start_date')} // Sử dụng form.watch() để kiểm tra giá trị
                >
                  Next
                </Button>

              </div>
            </div>
          )}

          {step === 3 && (

            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-medium">Confirm Booking</h3>

              <div className="space-y-4">
                <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Boarding</h4>
                  <div className="flex items-center">
                    <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                      {/* Icon based on service type would go here */}
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">
                        ${service.price} · {service.maxday}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedPet && (
                  <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Pet</h4>
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedPet.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {selectedPet.type} • {selectedPet.breed}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="glass-card dark:glass-card-dark p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Appointment</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{form.getValues('start_date') ? format(form.getValues('start_date'), "PPP") : "No date selected"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary p-2 rounded-full mr-3">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{form.getValues('end_date') ? format(form.getValues('end_date'), "PPP") : "No date selected"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Confirm Booking
                    </>
                  )}
                </Button>

              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingFormBoarding;