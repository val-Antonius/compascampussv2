'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaInfoCircle, FaGraduationCap, FaClipboardCheck } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardSummary({ studentData, creditDistribution }) {
  const [showSKSTooltip, setShowSKSTooltip] = useState(false);
  
  // Calculate percentage of credits
  const creditPercentage = (studentData.enrolledCredits / studentData.maxCredits) * 100;
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  return (
    <section className="grid md:grid-cols-2 gap-6">
      {/* Left side - Status cards */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaGraduationCap className="mr-2 text-blue-600" />
            Current Semester Status
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="font-medium">Enrolled Credits</span>
                <button 
                  className="ml-1 text-gray-500 hover:text-blue-600"
                  onMouseEnter={() => setShowSKSTooltip(true)}
                  onMouseLeave={() => setShowSKSTooltip(false)}
                >
                  <FaInfoCircle size={14} />
                </button>
                
                {/* SKS Tooltip */}
                {showSKSTooltip && (
                  <div className="absolute bg-gray-800 text-white text-xs rounded p-2 max-w-xs mt-1 z-10 ml-6">
                    SKS (Satuan Kredit Semester) represents the academic credit system used in Indonesian universities. 
                    Each course has a specific SKS value based on its academic workload.
                  </div>
                )}
              </div>
              <span className="text-blue-600 font-semibold">
                {studentData.enrolledCredits}/{studentData.maxCredits} SKS
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${creditPercentage >= 75 ? 'bg-green-600' : 'bg-blue-600'}`}
                style={{ width: `${creditPercentage}%` }}>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Active Courses</p>
              <p className="text-xl font-bold text-blue-600">{studentData.activeCourses}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Semester</p>
              <p className="text-xl font-bold text-blue-600">{studentData.semester}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaClipboardCheck className="mr-2 text-orange-500" />
            Pending Actions
          </h2>
          
          {studentData.pendingApprovals > 0 || studentData.upcomingDeadlines > 0 ? (
            <ul className="space-y-4">
              {studentData.pendingApprovals > 0 && (
                <li className="flex items-start p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-700">
                      {studentData.pendingApprovals} enrollment{studentData.pendingApprovals > 1 ? 's' : ''} awaiting approval
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                      Check your enrollment status for pending courses
                    </p>
                  </div>
                </li>
              )}
              
              {studentData.upcomingDeadlines > 0 && (
                <li className="flex items-start p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <FaExclamationTriangle className="text-red-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-red-700">
                      {studentData.upcomingDeadlines} upcoming deadline{studentData.upcomingDeadlines > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      Course registration period ends soon
                    </p>
                  </div>
                </li>
              )}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-green-600 font-medium">No pending actions at this time</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right side - Credit distribution chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Credit Distribution</h2>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={creditDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {creditDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} SKS`, 'Credits']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Your current credit distribution is optimized for your academic track. Consider adding 
            more elective courses to diversify your learning experience.
          </p>
        </div>
      </div>
    </section>
  );
}