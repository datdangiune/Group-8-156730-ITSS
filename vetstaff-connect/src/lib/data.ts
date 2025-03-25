
// Mock data for the Vet & Staff Web app

// Appointment data
export const appointments = [
  {
    id: "apt-001",
    petName: "Max",
    petType: "Dog",
    petBreed: "Golden Retriever",
    ownerName: "John Smith",
    date: "Today",
    time: "9:00 AM",
    reason: "Annual Checkup",
    status: "completed",
    notes: "Healthy overall. Due for vaccinations next month."
  },
  {
    id: "apt-002",
    petName: "Luna",
    petType: "Cat",
    petBreed: "Siamese",
    ownerName: "Sarah Johnson",
    date: "Today",
    time: "10:30 AM",
    reason: "Vaccination",
    status: "in-progress",
    notes: "First round of kitten vaccinations."
  },
  {
    id: "apt-003",
    petName: "Bella",
    petType: "Dog",
    petBreed: "Labrador",
    ownerName: "Michael Davis",
    date: "Today",
    time: "1:15 PM",
    reason: "Skin Condition",
    status: "upcoming",
    notes: "Recurring skin irritation on front legs."
  },
  {
    id: "apt-004",
    petName: "Charlie",
    petType: "Bird",
    petBreed: "Cockatiel",
    ownerName: "Emily Wilson",
    date: "Today",
    time: "3:00 PM",
    reason: "Wing Clipping",
    status: "upcoming",
    notes: "Regular wing trimming appointment."
  },
  {
    id: "apt-005",
    petName: "Oreo",
    petType: "Cat",
    petBreed: "Domestic Shorthair",
    ownerName: "Jessica Brown",
    date: "Tomorrow",
    time: "9:45 AM",
    reason: "Dental Cleaning",
    status: "upcoming",
    notes: "Pre-op exam for dental procedure."
  },
  {
    id: "apt-006",
    petName: "Rocky",
    petType: "Dog",
    petBreed: "Beagle",
    ownerName: "Thomas Miller",
    date: "Tomorrow",
    time: "11:30 AM",
    reason: "X-Ray Follow-up",
    status: "upcoming",
    notes: "Check healing progress after leg injury."
  },
] as const;

// Medical records data
export const medicalRecords = [
  {
    id: "rec-001",
    petName: "Max",
    petId: "pet-001",
    ownerName: "John Smith",
    recordDate: "2023-10-15",
    diagnosis: "Healthy, routine examination",
    treatments: ["Rabies vaccine", "Heartworm test (negative)"],
    prescriptions: ["Heartgard Plus - 6 month supply"],
    notes: "Weight: 65 lbs, slight tartar buildup on teeth. Recommend dental cleaning in next 6 months."
  },
  {
    id: "rec-002",
    petName: "Luna",
    petId: "pet-002",
    ownerName: "Sarah Johnson",
    recordDate: "2023-11-03",
    diagnosis: "Upper respiratory infection",
    treatments: ["Antibiotic injection", "Fluid therapy"],
    prescriptions: ["Amoxicillin - 10 day course"],
    notes: "Follow-up appointment scheduled for next week. Monitor breathing and appetite."
  },
  {
    id: "rec-003",
    petName: "Bella",
    petId: "pet-003",
    ownerName: "Michael Davis",
    recordDate: "2023-11-10",
    diagnosis: "Allergic dermatitis",
    treatments: ["Skin scraping", "Allergy testing"],
    prescriptions: ["Apoquel - 30 day supply", "Medicated shampoo"],
    notes: "Suspected environmental allergies. Elimination diet discussed with owner."
  },
] as const;

// Service data
export const services = [
  {
    id: "svc-001",
    petName: "Daisy",
    petType: "Dog",
    serviceType: "Grooming",
    status: "in-progress",
    startTime: "9:00 AM",
    estimatedEndTime: "10:30 AM",
    notes: "Full groom with nail trimming and ear cleaning"
  },
  {
    id: "svc-002",
    petName: "Oscar",
    petType: "Cat",
    serviceType: "Bathing",
    status: "completed",
    startTime: "8:30 AM",
    estimatedEndTime: "9:15 AM",
    notes: "Medicated bath for skin condition"
  },
  {
    id: "svc-003",
    petName: "Milo",
    petType: "Dog",
    serviceType: "Dental Cleaning",
    status: "upcoming",
    startTime: "11:00 AM",
    estimatedEndTime: "1:00 PM",
    notes: "Under anesthesia, full dental scaling and polishing"
  },
] as const;

// Boarding data
export const boardingPets = [
  {
    id: "brd-001",
    petName: "Cooper",
    petType: "Dog",
    petBreed: "Australian Shepherd",
    ownerName: "Robert Johnson",
    ownerPhone: "555-123-4567",
    checkInDate: "2023-11-08",
    checkOutDate: "2023-11-12",
    status: "active",
    feedingInstructions: "Twice daily, 1 cup grain-free kibble with 1/4 can wet food",
    medications: ["Thyroid medication - 1 pill every morning with food"],
    specialInstructions: "Needs daily 30-minute exercise. Prefers quiet space away from other dogs."
  },
  {
    id: "brd-002",
    petName: "Chloe",
    petType: "Cat",
    petBreed: "Maine Coon",
    ownerName: "Amanda Wilson",
    ownerPhone: "555-987-6543",
    checkInDate: "2023-11-09",
    checkOutDate: "2023-11-15",
    status: "active",
    feedingInstructions: "Three times daily, 1/3 can wet food",
    medications: [],
    specialInstructions: "Shy around other animals. Prefers hiding spots. Favorite toy included."
  },
  {
    id: "brd-003",
    petName: "Buddy",
    petType: "Dog",
    petBreed: "Poodle Mix",
    ownerName: "David Thompson",
    ownerPhone: "555-456-7890",
    checkInDate: "2023-11-10",
    checkOutDate: "2023-11-13",
    status: "active",
    feedingInstructions: "Twice daily, 3/4 cup senior formula kibble",
    medications: ["Joint supplement with dinner", "Ear drops as needed if scratching"],
    specialInstructions: "Older dog, needs gentle handling. Prefers shorter walks multiple times/day."
  },
] as const;

// Notifications data
export const notifications = [
  {
    id: "notif-001",
    title: "New appointment request",
    description: "Max (Golden Retriever) - Vaccination",
    time: "2 minutes ago",
    type: "appointment",
    read: false
  },
  {
    id: "notif-002",
    title: "Lab results ready",
    description: "Luna (Siamese) - Blood work",
    time: "1 hour ago",
    type: "alert",
    read: false
  },
  {
    id: "notif-003",
    title: "Medication reminder",
    description: "Cooper (Australian Shepherd) - Thyroid medication due",
    time: "3 hours ago",
    type: "reminder",
    read: true
  },
  {
    id: "notif-004",
    title: "Service completed",
    description: "Oscar (Cat) - Bathing service completed",
    time: "5 hours ago",
    type: "service",
    read: true
  },
  {
    id: "notif-005",
    title: "Message from pet owner",
    description: "Sarah Johnson (Luna's owner) - Question about medication",
    time: "Yesterday",
    type: "message",
    read: true
  },
  {
    id: "notif-006",
    title: "Boarding status update",
    description: "Buddy (Poodle Mix) - Daily photo sent to owner",
    time: "Yesterday",
    type: "boarding",
    read: true
  },
] as const;

// Dashboard stats
export const dashboardStats = {
  todayAppointments: 12,
  appointmentsChange: {
    value: 8,
    type: "increase"
  },
  activeBoarders: 7,
  boardersChange: {
    value: 2,
    type: "increase"
  },
  pendingServices: 5,
  servicesChange: {
    value: 3,
    type: "decrease"
  },
  unreadNotifications: 4,
  notificationsChange: {
    value: 50,
    type: "increase"
  }
};
