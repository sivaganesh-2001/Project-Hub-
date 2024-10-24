const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    guideApproval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    inchargeApproval: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    evaluations: [{
        date: { type: Date, default: Date.now },
        evaluator: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
        marks: { type: Number },
        comments: { type: String }
    }]
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = Project;

