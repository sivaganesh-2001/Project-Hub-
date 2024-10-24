const Batch = require('../models/batch');
const Faculty = require('../models/faculty');
const Department = require('../models/department');

// Create a new batch
exports.createBatch = async (req, res) => {
  try {
    const { batchCode, tutorRegNumber, projectInchargeRegNumber } = req.body;

    // Assuming req.user contains the authenticated user's data (e.g., HOD's information)
    const userId = req.user._id; // Get HOD's ID from the authenticated user
    const hod = await Faculty.findOne({ userId }).populate('departmentIds'); // Fetch HOD details with their departments



    // Fetch the department ID from HOD's profile
    const deptId = hod.departmentIds[0]; // Assuming the HOD is assigned to only one department

    if (!deptId) {
      return res.status(400).json({ error: 'HOD is not assigned to any department' });
    }

    let tutorId = null;
    let projectIncharge = null;

    // Fetch the ObjectId for tutor if registration number is provided
    if (tutorRegNumber) {
      const tutor = await Faculty.findOne({ registrationNumber: tutorRegNumber });
      if (!tutor) {
        return res.status(400).json({ error: 'Invalid tutor registration number' });
      }
      tutorId = tutor._id;
    }

    // Fetch the ObjectId for project incharge if registration number is provided
    if (projectInchargeRegNumber) {
      const incharge = await Faculty.findOne({ registrationNumber: projectInchargeRegNumber });
      if (!incharge) {
        return res.status(400).json({ error: 'Invalid project incharge registration number' });
      }
      projectIncharge = incharge._id;
    }

    // Create a new batch
    const batch = new Batch({
      batchCode,
      deptId, // Automatically fetched from the HOD
      tutorId,
      projectIncharge,
    });

    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Get all batches
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate('deptId').populate('tutorId').populate('projectIncharge');
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific batch by batchCode
exports.getBatchByCode = async (req, res) => {
  try {
    const { batchCode } = req.body;
    const batch = await Batch.findOne({ batchCode }).populate('deptId').populate('tutorId').populate('projectIncharge');
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update batch (including faculty using registration numbers)
exports.updateBatch = async (req, res) => {
  try {
    const { batchCode, tutorRegNumber, projectInchargeRegNumber, deptId, newBatchCode } = req.body;

    // Ensure that the batchCode is provided for the update
    if (!batchCode) {
      return res.status(400).json({ error: 'Batch code is required for updates' });
    }

    const updateFields = {};

    // Update tutorId if tutorRegNumber is provided
    if (tutorRegNumber) {
      const tutor = await Faculty.findOne({ registrationNumber: tutorRegNumber });
      if (!tutor) {
        return res.status(400).json({ error: 'Invalid tutor registration number' });
      }
      updateFields.tutorId = tutor._id;
    }

    // Update projectIncharge if projectInchargeRegNumber is provided
    if (projectInchargeRegNumber) {
      const incharge = await Faculty.findOne({ registrationNumber: projectInchargeRegNumber });
      if (!incharge) {
        return res.status(400).json({ error: 'Invalid project incharge registration number' });
      }
      updateFields.projectIncharge = incharge._id;
    }

    // Update department ID if provided
    if (deptId) {
      const department = await Department.findById(deptId);
      if (!department) {
        return res.status(400).json({ error: 'Invalid department ID' });
      }
      updateFields.deptId = deptId;
    }

    // Update batchCode if newBatchCode is provided
    if (newBatchCode) {
      updateFields.batchCode = newBatchCode;
    }

    // Perform the update on the batch
    const batch = await Batch.findOneAndUpdate({ batchCode }, updateFields, { new: true });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.status(200).json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a batch
exports.deleteBatch = async (req, res) => {
  try {
    const { batchCode } = req.body;

    const batch = await Batch.findOneAndDelete({ batchCode });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.status(204).send(); // No content to return on successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
