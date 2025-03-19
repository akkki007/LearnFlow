import mongoose from "mongoose";
import bcrypt from "bcrypt";

const studentSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    enrollmentNo: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    division: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String, // Used for Google login
        unique: true,
        sparse: true, // Allows null values without unique constraint issues
    },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
    },
    role: {
        type: String,
        enum: ["student"],
        default: "student",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
    },
    practicals: [
        {
            practicalId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Practical", // Reference to the Practical schema
                required: true,
            },
            status: {
                type: String,
                enum: ["in-progress", "completed"],
                default: "in-progress",
            },
            completedAt: {
                type: Date, // Timestamp when the practical was completed
            },
        },
    ],
});

// Hash password before saving
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for login
studentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Student || mongoose.model("Student", studentSchema);