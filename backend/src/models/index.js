const User = require('./User');
const Pet = require('./Pet');
const Appointment = require('./Appointment');
const Service = require('./Service');
const Boarding = require('./Boarding');
const MedicalRecord = require('./MedicalRecord');
const Notification = require('./Notification');
const Payment = require('./Payment');
const Room = require('./Room');
const ServiceUser = require('./ServiceUser')

Pet.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Pet.hasMany(Service, { foreignKey: 'pet_id', as: 'services' });
Pet.hasMany(Boarding, { foreignKey: 'pet_id', as: 'boarding' });

Appointment.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
Appointment.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Appointment.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });

Service.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });

Boarding.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
Boarding.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Boarding.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

MedicalRecord.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
MedicalRecord.belongsTo(User, { foreignKey: 'vet_id', as: 'vet' });

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Payment.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });
Payment.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });


ServiceUser.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Service.hasMany(ServiceUser, { foreignKey: 'serviceId', as: 'serviceUsers' });

// Liên kết ServiceUser với User
ServiceUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ServiceUser, { foreignKey: 'userId', as: 'serviceUsers' });

// Liên kết ServiceUser với Pet
ServiceUser.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });
Pet.hasMany(ServiceUser, { foreignKey: 'petId', as: 'serviceUsers' });

module.exports = {
    User,
    Pet,
    Appointment,
    Service,
    Boarding,
    MedicalRecord,
    Notification,
    Payment,
    Room,
    ServiceUser
};