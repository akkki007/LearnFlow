import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    practicalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Practical",
        required: true,
    },
    status: {
        type: String,
        enum: ["Completed", "Issue", "Pending"],
        default: "Pending",
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


submissionSchema.index({ studentId: 1, practicalId: 1 }, { unique: true });
submissionSchema.index({ status: 1 });
submissionSchema.index({ createdAt: -1 });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;