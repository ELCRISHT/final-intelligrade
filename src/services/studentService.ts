import { Student } from '../../types';
import { getApiUrl } from '../utils/api';

// Fetch all students
export const fetchStudents = async (college?: string): Promise<Student[]> => {
  try {
    const API_BASE_URL = getApiUrl();
    const url = college 
      ? `${API_BASE_URL}/students?college=${encodeURIComponent(college)}`
      : `${API_BASE_URL}/students`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch students');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Fetch single student by ID
export const fetchStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
};

// Create new student
export const createStudent = async (student: Student): Promise<Student | null> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    
    if (!response.ok) throw new Error('Failed to create student');
    return await response.json();
  } catch (error) {
    console.error('Error creating student:', error);
    return null;
  }
};

// Update student
export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<Student | null> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) throw new Error('Failed to update student');
    return await response.json();
  } catch (error) {
    console.error('Error updating student:', error);
    return null;
  }
};

// Delete student
export const deleteStudent = async (studentId: string): Promise<boolean> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting student:', error);
    return false;
  }
};

// Bulk import students
export const importStudents = async (students: Student[]): Promise<{ success: number; failed: number }> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/students/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
    
    if (!response.ok) throw new Error('Failed to import students');
    return await response.json();
  } catch (error) {
    console.error('Error importing students:', error);
    return { success: 0, failed: students.length };
  }
};

// Get analytics data
export const fetchAnalytics = async (college?: string): Promise<any> => {
  try {
    const API_BASE_URL = getApiUrl();
    const url = college 
      ? `${API_BASE_URL}/analytics?college=${encodeURIComponent(college)}`
      : `${API_BASE_URL}/analytics`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};
