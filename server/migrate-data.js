/**
 * Data Migration Script
 * Migrates mock student data to MongoDB
 * 
 * Usage: node migrate-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

// College and Tool constants (matching frontend)
const COLLEGES = [
  "College of Computer Studies",
  "College of Engineering",
  "College of Arts and Sciences",
  "College of Criminal Justice Education",
  "College of Teacher Education",
  "College of Industrial Technology",
  "College of International Hospitality Management and Tourism",
  "College of Business Administration and Accountancy"
];

const TOOLS = ["ChatGPT", "Gemini", "Grammarly", "Quillbot", "Bing AI"];
const PURPOSES = ["Grammar", "Problem-solving", "Essay writing", "Research", "Coding", "Summary", "Brainstorming"];

// Helper functions
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate students (same logic as frontend)
const generateStudents = (count) => {
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const college = pick(COLLEGES);
    let reading = random(1, 7);
    let writing = random(1, 7);
    let numeracy = random(1, 7);
    let motivation = random(1, 7);
    
    // Create some at-risk students
    if (Math.random() > 0.7) {
       reading = random(5, 7);
       writing = random(5, 7);
       numeracy = random(5, 7);
       motivation = random(1, 3.5);
    } else if (Math.random() > 0.7) {
       reading = random(1, 4);
       writing = random(1, 4);
       numeracy = random(1, 4);
       motivation = random(5.5, 7);
    }

    students.push({
      Student_ID: `S${1000 + i}`,
      College: college,
      Year_Level: randomInt(1, 4),
      Reading_Dependency_Score: parseFloat(reading.toFixed(1)),
      Writing_Dependency_Score: parseFloat(writing.toFixed(1)),
      Numeracy_Dependency_Score: parseFloat(numeracy.toFixed(1)),
      Motivation_Score: parseFloat(motivation.toFixed(1)),
      AI_Tools_Count: randomInt(1, 6),
      Primary_AI_Tool: pick(TOOLS),
      Usage_Purpose: pick(PURPOSES)
    });
  }
  return students;
};

// Main migration function
async function migrateData() {
  console.log('🚀 Starting data migration...\n');

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
    console.error('❌ Error: Please update MONGODB_URI in server/.env with your actual MongoDB connection string.');
    console.log('\n📋 To get your connection string:');
    console.log('   1. Go to https://cloud.mongodb.com/');
    console.log('   2. Select your cluster → Connect → Connect your application');
    console.log('   3. Copy the connection string and replace <password> with your password');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if data already exists
    const existingCount = await Student.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already contains ${existingCount} students.`);
      console.log('   Do you want to replace them? (This script will add to existing data)');
      console.log('   To clear existing data first, run: db.students.deleteMany({}) in MongoDB Atlas\n');
    }

    // Generate student data
    console.log('📊 Generating 381 student records...');
    const students = generateStudents(381);

    // Insert into MongoDB
    console.log('💾 Inserting students into MongoDB...');
    const result = await Student.insertMany(students, { ordered: false });
    
    console.log(`\n✅ Successfully migrated ${result.length} students to MongoDB!`);

    // Print summary
    const collegeCounts = {};
    students.forEach(s => {
      collegeCounts[s.College] = (collegeCounts[s.College] || 0) + 1;
    });

    console.log('\n📈 Distribution by College:');
    Object.entries(collegeCounts).forEach(([college, count]) => {
      console.log(`   ${college}: ${count} students`);
    });

    // Calculate at-risk count
    const atRiskCount = students.filter(s => {
      const avgDep = (s.Reading_Dependency_Score + s.Writing_Dependency_Score + s.Numeracy_Dependency_Score) / 3;
      return avgDep > 5.5 && s.Motivation_Score < 4.5;
    }).length;

    console.log(`\n⚠️  At-Risk Students: ${atRiskCount}`);

  } catch (error) {
    if (error.code === 11000) {
      console.log('\n⚠️  Some duplicate Student IDs were skipped (data may already exist).');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    console.log('\n🎉 Migration complete!');
  }
}

// Run migration
migrateData();
