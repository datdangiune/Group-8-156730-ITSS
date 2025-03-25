import React, { useState } from "react";

// Định nghĩa enum cho PetType và Gender
type PetType = "dog" | "cat" | "bird" | "rabbit" | "fish" | "other";
type Gender = "Male" | "Female";

const AddPet: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    type: "" as PetType,
    gender: "" as Gender,
    breed: "",
    fur_color: "",
    health_status: "",
    diet_plan: "",
    medical_history: "",
    vaccination_history: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Pet Data:", formData);

  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Type</label>
        <select name="type" value={formData.type} onChange={handleChange} className="input">
          {["dog", "cat", "bird", "rabbit", "fish", "other"].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} className="input">
          {["Male", "Female"].map((gender) => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Breed</label>
        <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Fur Color</label>
        <input type="text" name="fur_color" value={formData.fur_color} onChange={handleChange} className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Health Status</label>
        <input type="text" name="health_status" value={formData.health_status} onChange={handleChange} className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Diet Plan</label>
        <input type="text" name="diet_plan" value={formData.diet_plan} onChange={handleChange} className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Medical History</label>
        <input type="text" name="medical_history" value={formData.medical_history} onChange={handleChange} className="input" />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Vaccination History</label>
        <input type="text" name="vaccination_history" value={formData.vaccination_history} onChange={handleChange} className="input" />
      </div>
      <button type="submit" className="btn-primary">Submit</button>
    </form>
  );
};

export default AddPet;