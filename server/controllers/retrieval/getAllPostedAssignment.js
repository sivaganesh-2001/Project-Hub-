const Assignment = require('../../models/assignments'); // Adjust the path as necessary
const Faculty = require('../../models/faculty'); // Adjust the path as necessary

// Fetch all assignments posted by the logged-in faculty
exports.getAssignmentsByFaculty = async (req, res) => {
  const userId = req.user._id; // Get the logged-in user's ID

  try {
    // Fetch faculty details by userId
    //const faculty = await Faculty.findOne({ userId });

    // if (!faculty) {
    //   return res.status(404).json({ message: 'Faculty not found' });
    // }

    // Fetch assignments posted by this faculty
    const assignments = await Assignment.find({ postedBy: userId})
      .sort({ postDate: -1 }); // Sort assignments by post date descending
      console.log(assignments.length);
    res.status(200).json(assignments.length ? assignments : []);
  } catch (error) {
    console.error('Error retrieving assignments:', error);
    res.status(500).json({ message: 'An error occurred while retrieving assignments.', error: error.message });
  }
};

exports.getAssignmentDetails = async (req, res) => {
    const assignmentId = req.params.assignmentId; // Get assignment ID from the request parameters
    console.log('Fetching details for assignment ID:', assignmentId);
    
    try {
        // Fetch the assignment by ID, populating the submissions with student details
        const assignment = await Assignment.findById(assignmentId)
            .populate({
                path: 'submissions.studentId', // Populate the studentId field in submissions
                select: 'name rollNo' // Select only the name and rollNo fields
            })
            .populate('postedBy', 'name'); // Populate the faculty who posted the assignment

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        console.log('Fetched assignment:', assignment); // Log the assignment details

        // Prepare submission details
        const submissionDetails = assignment.submissions.map(submission => ({
            rollNo: submission.studentId ? submission.studentId.rollNo : 'N/A', // Roll number of the student
            name: submission.studentId ? submission.studentId.name : 'N/A', // Name of the student
            submittedOn: submission.submissionDate ? submission.submissionDate.toISOString().split('T')[0] : 'Not submitted', // Format submission date or message if not submitted
            fileUrl: submission.fileUrl || 'No PDF available' // Link to the submitted PDF
        }));

        // Return assignment details and submissions in a tabular format
        res.status(200).json({
            assignmentTitle: assignment.title,
            assignmentDescription: assignment.description,
            postedBy: assignment.postedBy ? assignment.postedBy.name : 'Unknown', // Handle potential null
            postDate: assignment.postDate,
            dueDate: assignment.dueDate,
            submissions: submissionDetails
        });
    } catch (error) {
        console.error('Error retrieving assignment details:', error);
        res.status(500).json({ message: 'An error occurred while retrieving assignment details.', error: error.message });
    }
};

  
