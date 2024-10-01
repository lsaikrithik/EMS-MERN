import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ // Regex for email validation 
    },
    mobile: { 
        type: String, // Changed to String to handle leading zeros
        required: true, 
        validate: { 
            validator: function(v) {
                return /^\d{10}$/.test(v); // Matches exactly 10 digits
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    designation: { type: String },
    gender: { type: String, enum: ['M', 'F'] }, // Only M/F allowed
    course: { type: String, enum: ['MCA', 'BCA', 'BSC'] }, // Only specified courses allowed
    image: { type: String }, // This will store the image path
    createAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Check for duplicate email before saving
employeeSchema.pre('save', async function(next) {
    const existingEmployee = await this.constructor.findOne({ email: this.email });
    if (existingEmployee) {
        return next(new Error('Email already exists'));
    }
    next();
});

// Automatically update the updatedAt field on save
employeeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
