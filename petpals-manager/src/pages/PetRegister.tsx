
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, ArrowLeft, Upload } from 'lucide-react';

import { PetFormValues } from '@/types/petFormValue';
import { getTokenFromCookies } from '@/service/auth';
const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would be a URL from the server
      resolve(URL.createObjectURL(file));
    }, 1000);
  });
};


const PetRegistration = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const isEditMode = !!id;
    const token = getTokenFromCookies();
    const form = useForm<PetFormValues>({
        defaultValues: {
          name: "",
          age: 0,
          gender: "male",
          type: "dog",
          breed: "",
          fur_color: "",
          health_status: "healthy",
          diet_plan: "",
          medical_history: "",
          vaccination_history: "",
          image: null,
        },
      });
      

  // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        try {
            setIsUploading(true);
            const imageUrl = await uploadImage(file);
            setSelectedImage(imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
        }
    };

  // Handle form submission
    const onSubmit = async (data: PetFormValues) => {
        try {
        console.log("Submitting pet data:", { ...data, image: selectedImage });
        toast.success(isEditMode ? "Pet updated successfully!" : "Pet registered successfully!");
        navigate("/pets");
        } catch (error) {
        console.error("Failed to submit pet data:", error);
        toast.error("Failed to submit pet data. Please try again.");
        }
    };
    useEffect(() => {
        if(!token){
          navigate('/login')
        }
    }, [token]);
    
    return (
        <div className="container mx-auto px-4 animate-fade-in">
        <div className="flex items-center mb-6">
            <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/pets")}
            >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Pets
            </Button>
            <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Pet" : "Register New Pet"}
            </h1>
        </div>

        <Card className="max-w-3xl mx-auto">
            <CardHeader>
            <CardTitle>{isEditMode ? "Edit Pet Information" : "Pet Registration"}</CardTitle>
            <CardDescription>
                {isEditMode 
                ? "Update your pet's information below" 
                : "Add your pet's information to register them in our system"}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pet Name *</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter pet name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pet Type *</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select pet type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="rabbit">Rabbit</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender *</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter breed" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Age (years)</FormLabel>
                        <FormControl>
                            <Input 
                            type="number" 
                            placeholder="Enter age" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="fur_color"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                            <Input 
                            type="string" 
                            placeholder="Enter color" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="health_status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Health Status</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select health status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="healthy">Healthy</SelectItem>
                            <SelectItem value="under-treatment">Under Treatment</SelectItem>
                            <SelectItem value="requires-attention">Requires Attention</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                {/* Image Upload */}
                <div className="border rounded-lg p-4">
                    <FormLabel className="block mb-2">Pet Photo</FormLabel>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        {selectedImage ? (
                        <img 
                            src={selectedImage} 
                            alt="Pet preview" 
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <PlusCircle className="h-8 w-8" />
                        </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input
                        id="pet-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        />
                        <label htmlFor="pet-image">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-center"
                            disabled={isUploading}
                            asChild
                        >
                            <span>
                            <Upload className="h-4 w-4 mr-2" />
                            {isUploading ? "Uploading..." : "Upload Photo"}
                            </span>
                        </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, GIF. Max size: 5MB.
                        </p>
                    </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                    <FormField
                    control={form.control}
                    name="diet_plan"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Diet Plan</FormLabel>
                        <FormControl>
                            <Textarea 
                            placeholder="Enter diet information" 
                            {...field} 
                            className="min-h-24"
                            />
                        </FormControl>
                        <FormDescription>
                            Include details about feeding schedule and food type.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="medical_history"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                            <Textarea 
                            placeholder="Enter medical history" 
                            {...field} 
                            className="min-h-24"
                            />
                        </FormControl>
                        <FormDescription>
                            Include any past illnesses, surgeries, or ongoing conditions.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="vaccination_history"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Vaccination History</FormLabel>
                        <FormControl>
                            <Textarea 
                            placeholder="Enter vaccination details" 
                            {...field} 
                            className="min-h-24"
                            />
                        </FormControl>
                        <FormDescription>
                            List vaccines received and dates.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <CardFooter className="px-0 pt-4 flex justify-between">
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
                        navigate("/pets");
                        }
                    }}
                    >
                    Cancel
                    </Button>
                    <Button type="submit">
                    {isEditMode ? "Update Pet" : "Register Pet"}
                    </Button>
                </CardFooter>
                </form>
            </Form>
            </CardContent>
        </Card>
        </div>
    );
};

export default PetRegistration;