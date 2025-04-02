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
const BoardingUser = require('./BoardingUser')
Pet.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Pet.hasMany(Service, { foreignKey: 'pet_id', as: 'services' });
Pet.hasMany(Boarding, { foreignKey: 'pet_id', as: 'boarding' });

Appointment.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });
Appointment.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Appointment.belongsTo(User, { foreignKey: 'staff_id', as: 'staff' });




// Thiết lập quan hệ giữa Pet và MedicalRecord
Pet.hasMany(MedicalRecord, { foreignKey: 'pet_id' });
MedicalRecord.belongsTo(Pet, { foreignKey: 'pet_id' });

// Thiết lập quan hệ giữa Appointment và MedicalRecord
Appointment.hasMany(MedicalRecord, { foreignKey: 'appointment_id' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// Thiết lập quan hệ giữa User và MedicalRecord
User.hasMany(MedicalRecord, { foreignKey: 'user_id' });
MedicalRecord.belongsTo(User, { foreignKey: 'user_id' });


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

// Quan hệ giữa User và BoardingUser (1:N)
User.hasMany(BoardingUser, { foreignKey: 'userId', as: 'boardingUser'});
BoardingUser.belongsTo(User, { foreignKey: 'userId', as: 'user' }); 

// Quan hệ giữa Pet và BoardingUser (1:N)
Pet.hasMany(BoardingUser, { foreignKey: 'petId', as: 'boardingUser'});
BoardingUser.belongsTo(Pet, { foreignKey: 'petId', as: 'pet'});

// Quan hệ giữa Boarding và BoardingUser (1:N)
Boarding.hasMany(BoardingUser, { foreignKey: 'boardingId', as: 'boardingUser'});
BoardingUser.belongsTo(Boarding, { foreignKey: 'boardingId', as: 'boarding'});

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
    ServiceUser,
    BoardingUser
};