const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Group = require('../models/group');
const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Batch = require('../models/batch');
const Department = require('../models/department');
const nodemailer = require('nodemailer'); // Import nodemailer
const dotenv = require('dotenv');

// Configure Nodemailer transport (Example: Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD, // Use the app password here
  },
});


// Function to send the registration email
const sendRegistrationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // List of receivers
    subject: 'Project Hub Account Created', // Subject line
    text: 'Your Project Hub account has been successfully created!', // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Registration email sent to:', email);
  } catch (error) {
    console.error('Error sending registration email:', error);
  }
};

exports.register = async (req, res) => {
  const { email, password, roles = [], batchCode, deptId, ...otherDetails } = req.body;
  console.log('Received request body:', req.body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email }).session(session);
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'A user with this email already exists. Please use a different email address.' });
    }

    // Create the new user
    const user = await User.create([{ email, password, roles }], { session });
    const userId = user[0]._id;

    let batch;
    let department;

    // Handle batch validation for students, tutors, and project incharge
    if (roles.includes('student') || roles.includes('tutor') || roles.includes('projectIncharge')) {
      if (!batchCode) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Batch code is required for student, tutor, or projectIncharge registration.' });
      }

      batch = await Batch.findOne({ batchCode }).session(session);
      if (!batch) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Batch with the provided code not found.' });
      }
    }

    // Handle department validation for HOD, Tutor, and Project Incharge
    if (roles.includes('hod') || roles.includes('tutor') || roles.includes('projectIncharge')) {
      if (!deptId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Department ID is required for HOD, Tutor, or Project Incharge registration.' });
      }

      department = await Department.findOne({ deptId }).session(session);
      if (!department) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Department with the provided ID not found.' });
      }
    }

    // Handle HOD registration
    if (roles.includes('hod') && roles.includes('projectGuide')) {
      const faculty = new Faculty({
        userId,
        name: otherDetails.name,
        email,
        phone: otherDetails.phone,
        designation: otherDetails.designation,
        registrationNumber: otherDetails.registrationNumber,
        roles: roles.filter(role => ['projectGuide','hod'].includes(role)),
        departmentIds: [department._id], // Link department's ObjectId
      });

      await faculty.save({ session });

      department.hod = faculty._id;
      await department.save({ session });
    }

    else if (roles.includes('hod')) {
      const faculty = new Faculty({
        userId,
        name: otherDetails.name,
        email,
        phone: otherDetails.phone,
        designation: otherDetails.designation,
        registrationNumber: otherDetails.registrationNumber,
        roles: roles.filter(role => ['projectGuide', 'projectIncharge', 'tutor','hod'].includes(role)),
        departmentIds: [department._id], // Link department's ObjectId
      });

      await faculty.save({ session });

      department.hod = faculty._id;
      await department.save({ session });
    }

    // Handle student registration
    

    // Handle other faculty roles (Project Guide, Project Incharge, Tutor)
    else if (roles.includes('projectGuide') || roles.includes('projectIncharge') || roles.includes('tutor')) {
      const faculty = new Faculty({
        userId,
        name: otherDetails.name,
        email,
        phone: otherDetails.phone,
        designation: otherDetails.designation,
        registrationNumber: otherDetails.registrationNumber,
        roles: roles.filter(role => ['projectGuide', 'projectIncharge', 'tutor'].includes(role)),
        departmentIds: department ? [department._id] : [], // Link department's ObjectId if present
        batchCode: roles.includes('tutor') || roles.includes('projectIncharge') ? [batch._id] : [], // Assign batchCode for tutor/projectIncharge
      });

      await faculty.save({ session });

      if (roles.includes('tutor') && batch) {
        batch.tutorId = faculty._id;
        await batch.save({ session });
      }

      if (roles.includes('projectIncharge') && batch) {
        batch.projectIncharge = faculty._id;
        await batch.save({ session });
      }
    }

    if (roles.includes('student')) {
      const student = new Student({
        userId,
        name: otherDetails.name,
        rollNo: otherDetails.rollNo,
        email,
        roles: otherDetails.roles,
        phone: otherDetails.phone,
        batchCode: batch._id, // Use the found batch ObjectId
      });

      await student.save({ session });
    }

    // Commit transaction and end session
    await session.commitTransaction();
    session.endSession();

    // Send registration email
    await sendRegistrationEmail(email);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


    //login user
  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      // If user not found or password doesn't match
      if (!user || !(await user.matchPassword(password))) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token with user ID and roles in the payload
      const token = jwt.sign(
        { id: user._id, roles: user.roles }, // Include roles in the JWT payload
        process.env.JWT_SECRET,
        { expiresIn: '10h' } // Token expires in 1 hour
      );

      // Return the token and roles to the client
      res.status(200).json({ token, roles: user.roles });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  exports.updateUser = async (req, res) => {
    const { email, roles, groupId, batchCode, deptId, ...updateDetails } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user roles, if provided
        if (roles) {
            user.roles = roles; // Update the roles in the user collection
            await user.save();
        }

        let student, faculty;

        // Handle Student update
        if (user.roles.includes('student')) {
            student = await Student.findOne({ userId: user._id });
            if (student) {
                student.name = updateDetails.name || student.name;
                student.rollNo = updateDetails.rollNo || student.rollNo;
                student.phone = updateDetails.phone || student.phone;

                // Fetch the Group ID from the Group collection based on the provided alphanumeric groupId
                if (groupId) {
                    const group = await Group.findOne({ groupName: groupId });
                    if (group) student.groupId = group._id; // Set the ObjectId of the group
                }

                // Fetch the Batch ID from the Batch collection based on the provided alphanumeric batchCode
                if (batchCode) {
                    const batch = await Batch.findOne({ batchCode });
                    if (batch) student.batchCode = batch._id; // Set the ObjectId of the batch
                }

                await student.save();
            }
        }

        // Handle Faculty update
        if (user.roles.some(role => ['projectGuide', 'projectIncharge', 'hod', 'tutor'].includes(role))) {
            faculty = await Faculty.findOne({ userId: user._id });
            if (faculty) {
                // Update fields in faculty collection
                faculty.name = updateDetails.name || faculty.name;
                faculty.phone = updateDetails.phone || faculty.phone;
                faculty.designation = updateDetails.designation || faculty.designation;
                faculty.registrationNumber = updateDetails.registrationNumber || faculty.registrationNumber;

                // Update roles in faculty collection
                if (roles) {
                    faculty.roles = roles; // Update the roles in the faculty collection as well
                }

                // Fetch the Department ID from the Department collection based on the provided alphanumeric deptId
                if (deptId) {
                    const department = await Department.findOne({ deptId });
                    if (department) faculty.departmentIds = [department._id]; // Set the ObjectId of the department
                }

                // Fetch the Group ID from the Group collection based on the provided alphanumeric groupId
                if (groupId) {
                    const group = await Group.findOne({ groupName: groupId });
                    if (group) faculty.groupIds = [group._id]; // Set the ObjectId of the group
                }

                // Fetch the Batch ID from the Batch collection based on the provided alphanumeric batchCode
                if (batchCode) {
                    const batch = await Batch.findOne({ batchCode });
                    if (batch) faculty.batchCode = [batch._id]; // Set the ObjectId of the batch
                }

                await faculty.save();
            }
        }

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.viewUser = async (req, res) => {
  console.log('Received request body:', req.body);
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let student = null;
    let faculty = null;

    // Check if the user is a student and fetch their details
    if (user.roles.includes('student')) {
      student = await Student.findOne({ userId: user._id }).exec();
      if (!student) {
        return res.status(404).json({ message: 'Student details not found' });
      }

      // Return user and student details
      return res.status(200).json({
        user,
        student, // Include student details in the response
        faculty: null, // No faculty details to return if the user is a student
      });
    }

    // Check if the user is faculty and fetch their details
    if (user.roles.includes('projectGuide') || user.roles.includes('projectIncharge') || user.roles.includes('tutor') || user.roles.includes('hod')) {
      faculty = await Faculty.findOne({ userId: user._id })
        .populate('departmentIds', 'name') // Populate with only the name field
        .populate('batchCode', 'code') // Populate with only the code field
        .exec();

      console.log('Fetched faculty:', faculty); // Log the faculty object

      // Transform faculty object to display cleanly
      const facultyDetails = faculty ? {
        id: faculty.facultyId,
        name: faculty.name,
        email: faculty.email,
        phone: faculty.phone, // Assuming you have a phone field
        designation: faculty.designation,
        departments: faculty.departmentIds.map(dep => dep.name), // Extract names of departments
        roles: faculty.roles || [],
        batchCodes: faculty.batchCode.map(batch => batch.code) // Extract codes of batches
      } : null;

      // Return user and faculty details
      return res.status(200).json({
        user,
        student: null, // No student details to return if the user is faculty
        faculty: facultyDetails, // Send transformed faculty details
      });
    }

    // If the user is neither a student nor faculty
    return res.status(403).json({ message: 'User role not recognized' });
    
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

  
exports.deleteUser = async (req, res) => {
  const { email } = req.body; // Get email from the request body
  console.log(email);
  
  try {
    // Find user in the User collection by email
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user._id; // Get the userId from the User document

    // Check if the user is a faculty member or a student
    let faculty = await Faculty.findOne({ userId }).populate('userId').exec();
    let student = await Student.findOne({ userId }).populate('userId').exec();

    if (!faculty && !student) {
      return res.status(404).json({ message: 'Associated faculty/student record not found' });
    }

    // Delete associated student or faculty documents
    if (student) {
      await Student.findOneAndDelete({ userId }).exec();
    }
    if (faculty) {
      // Check for faculty roles and perform deletions
      await Faculty.findOneAndDelete({ userId }).exec();
      
      // Delete any related ObjectId references in other collections
      if (faculty.roles.includes('projectGuide') || faculty.roles.includes('tutor')) {
        await Batch.updateMany({ tutorId: faculty._id }, { $unset: { tutorId: "" } }).exec(); // Unset tutor reference in batches
      }
      if (faculty.roles.includes('hod')) {
        await Department.updateMany({ hod: faculty._id }, { $unset: { hod: "" } }).exec(); // Unset hod reference in departments
      }
    }

    // Delete the user from the User collection
    await User.findOneAndDelete({ _id: userId }).exec();

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


