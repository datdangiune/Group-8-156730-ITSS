import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X, Upload, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { BoardingServiceFormValues } from "@/types/boardingService";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const boardingServiceSchema = z.object({
  name: z.string().min(2, { message: "Service name is required" }),
  pricePerDay: z.coerce.number().positive({ message: "Price must be positive" }),
  maxDayStay: z.coerce.number().int().positive({ message: "Maximum stay must be a positive integer" }),
  status: z.enum(["available", "unavailable"]),
  details: z.object({
    amenities: z.array(z.string()),
  }).and(z.record(z.string(), z.any())),
  image: z.union([
    z.instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `Max file size is 5MB`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: "Only .jpg, .jpeg, .png and .webp files are accepted",
      }),
    z.string(),
    z.undefined()
  ]),
});

interface BoardingServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BoardingServiceFormValues) => void;
  initialData?: Partial<BoardingServiceFormValues>;
}

const BoardingServiceForm: React.FC<BoardingServiceFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image && typeof initialData.image === "string" ? initialData.image : null
  );
  const isEditMode = !!initialData?.name;

  const form = useForm<z.infer<typeof boardingServiceSchema>>({
    resolver: zodResolver(boardingServiceSchema),
    defaultValues: {
      name: initialData?.name || "",
      pricePerDay: initialData?.pricePerDay || 0,
      maxDayStay: initialData?.maxDayStay || 7,
      status: initialData?.status || "available",
      details: initialData?.details || {
        amenities: ["Food", "Water", "Daily Walks"],
      },
      image: initialData?.image,
    },
  });

  // Handle image file changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set the file directly without type casting
    form.setValue("image", file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle adding a new amenity
  const [newAmenity, setNewAmenity] = useState("");
  
  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    
    const currentAmenities = form.getValues("details.amenities") || [];
    form.setValue("details.amenities", [...currentAmenities, newAmenity.trim()]);
    setNewAmenity("");
  };

  // Handle removing an amenity
  const removeAmenity = (index: number) => {
    const currentAmenities = form.getValues("details.amenities") || [];
    form.setValue(
      "details.amenities",
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof boardingServiceSchema>) => {
    onSubmit(data as BoardingServiceFormValues);
    form.reset();
    setImagePreview(null);
    onClose();
    toast.success(`Boarding service ${isEditMode ? "updated" : "created"} successfully`);
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="h-[85%] sm:max-w-xl sm:mx-auto">
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle className="text-xl font-semibold">
            {isEditMode ? "Edit Boarding Service" : "New Boarding Service"}
          </DrawerTitle>
          <DrawerDescription>
            {isEditMode 
              ? "Update boarding service details" 
              : "Create a new boarding service for the clinic"}
          </DrawerDescription>
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="px-6 py-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter boarding service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Per Day ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxDayStay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Stay (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          step="1" 
                          placeholder="7"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="unavailable">Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Upload Service Image</FormLabel>
                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center border-2 border-dashed rounded-md h-32 cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="object-contain w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            form.setValue("image", undefined);
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <span>Click to upload an image</span>
                        <span className="text-xs">(max 5MB, JPG, PNG, WebP)</span>
                      </div>
                    )}
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                {form.formState.errors.image && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.image.message?.toString()}
                  </p>
                )}
              </FormItem>
              
              <div>
                <FormLabel>Amenities</FormLabel>
                <FormDescription>List the amenities included in this boarding service</FormDescription>
                
                <div className="space-y-2 mt-2">
                  {form.watch("details.amenities")?.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 p-2 bg-muted/20 rounded-md">{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAmenity(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Enter new amenity"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addAmenity}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              <DrawerFooter className="px-0 pb-0">
                <Button type="submit" className="w-full">
                  {isEditMode ? "Update Boarding Service" : "Create Boarding Service"}
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BoardingServiceForm;