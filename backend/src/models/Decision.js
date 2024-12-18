import mongoose from 'mongoose';

const decisionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a decision title'],
      trim: true,
      maxlength: [150, 'Decision title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a decision description'],
    },
    rationale: {
      type: String,
      required: [true, 'Please provide the rationale behind this decision'],
    },
    category: {
      type: String,
      required: [true, 'Please choose a category'],
      enum: [
        'Strategic',
        'Operational',
        'Financial',
        'HR',
        'Technical',
        'Other',
      ],
    },
    status: {
      type: String,
      enum: ['Draft', 'Under Review', 'Approved', 'Rejected', 'Implemented'],
      default: 'Draft',
    },
    outcome: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Partially Successful'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Decision must belong to a user'],
    },
    reviewedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    stakeholders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    dueDate: Date,
    decidedAt: Date,
    tags: [String],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
decisionSchema.index({ category: 1 });
decisionSchema.index({ status: 1 });
decisionSchema.index({ createdBy: 1 });

const Decision = mongoose.model('Decision', decisionSchema);

export default Decision;
