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

// Add this to your existing submission schema
submissionSchema.virtual('practical', {
    ref: 'Practical',
    localField: 'practicalId',
    foreignField: '_id',
    justOne: true
  });
  
  submissionSchema.set('toJSON', { virtuals: true });
  submissionSchema.set('toObject', { virtuals: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;