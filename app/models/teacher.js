import mongoose from "mongoose";
import bcrypt from "bcrypt";

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
        enum: ["teacher"],
        default: "teacher",
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
    },
    subject: {
        type: String,
        required: true,
        default: "JavaScript",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password for login
teacherSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
