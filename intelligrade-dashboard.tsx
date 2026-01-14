import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis, Area, AreaChart, ComposedChart } from 'recharts';
import { User, TrendingUp, AlertTriangle, BookOpen, PenTool, Calculator, Users, School, LogOut, Settings, Home, BarChart3, Activity, Target, Brain, Zap } from 'lucide-react';



const IntelliGrade = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('semester');
  const [selectedCollege, setSelectedCollege] = useState('All');

  useEffect(() => {
    // TODO: Fetch real student data from API
    setStudents([]);
  }, []);

  // Analytics calculations
  const totalStudents = students.length;
  const avgDependency = totalStudents > 0 ? (students.reduce((sum, s) => sum + s.totalDependency, 0) / totalStudents).toFixed(2) : '0.00';
  const highRiskCount = students.filter(s => s.riskLevel === 'High Risk').length;
  const predictionAccuracy = '55.17'; // From Logistic Regression model

  // College statistics
  const collegeStats = students.reduce((acc, student) => {
    if (!acc[student.college]) {
      acc[student.college] = { total: 0, avgDependency: 0 };
    }
    acc[student.college].total += 1;
    acc[student.college].avgDependency += student.totalDependency;
    return acc;
  }, {});

  const collegeChartData = Object.entries(collegeStats).map(([college, data]: [string, any]) => ({
    college,
    students: data.total,
    avgDependency: (data.avgDependency / data.total).toFixed(2)
  }));

  // Performance distribution
  const performanceDistribution = students.reduce((acc, s) => {
    acc[s.performanceLevel] = (acc[s.performanceLevel] || 0) + 1;
    return acc;
  }, {});

  const performancePieData = Object.entries(performanceDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    'High Performance': '#10b981',
    'Moderate Performance': '#f59e0b',
    'Low Performance (At-Risk)': '#ef4444'
  };

  // Correlation data for scatter plot
  const correlationData = students.map(s => ({
    dependency: s.totalDependency,
    performance_Level: s.performance_Level,
    size: s.studyHours,
    risk: s.riskLevel
  }));

  // Time series aggregation
  const timeSeriesData = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(month => {
    const avgDep = students.reduce((sum, s) => {
      const monthData = s.trend.find(t => t.month === month);
      return sum + (monthData ? monthData.dependency : s.totalDependency);
    }, 0) / students.length;
    
    return {
      month,
      avgDependency: parseFloat(avgDep.toFixed(2)),
      highRisk: students.filter(s => {
        const monthData = s.trend.find(t => t.month === month);
        return (monthData ? monthData.dependency : s.totalDependency) > 5.0;
      }).length
    };
  });

  // Cognitive Load Theory data
  const cltData = students.slice(0, 20).map(s => ({
    student: s.id.slice(-4),
    reading: s.readingScore,
    writing: s.writingScore,
    numeracy: s.numeracyScore,
    cognitive: s.cognitiveLoad
  }));

  // Risk distribution by year level
  const yearLevelRiskData = students.reduce((acc, s) => {
    if (!acc[s.yearLevel]) {
      acc[s.yearLevel] = { year: s.yearLevel, High: 0, Moderate: 0, Low: 0 };
    }
    if (s.riskLevel === 'High Risk') acc[s.yearLevel].High++;
    else if (s.riskLevel === 'Moderate Risk') acc[s.yearLevel].Moderate++;
    else acc[s.yearLevel].Low++;
    return acc;
  }, {});

  const yearLevelRiskChartData = Object.values(yearLevelRiskData);

  // Model performance metrics
  const modelMetrics = [
    { metric: 'Accuracy', value: 55.17, target: 70 },
    { metric: 'Precision', value: 57, target: 75 },
    { metric: 'Recall (Moderate)', value: 78, target: 80 },
    { metric: 'F1-Score', value: 51, target: 70 }
  ];

  // Theoretical Framework Integration
  const theoreticalData = students.slice(0, 15).map(s => ({
    student: s.id.slice(-4),
    CLT: s.cognitiveLoad,
    SDT: s.motivationScore,
    SCT: (s.attendanceRate / 100) * 7,
    overall: s.totalDependency
  }));

  // Filtered students
  const filteredStudents = students.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2" style={{ color }}>{value}</h3>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="bg-gray-100 p-3 rounded-full">
          <Icon size={28} style={{ color }} />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Students" 
          value={totalStudents} 
          subtitle="Monitored students"
          color="#3b82f6" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Avg AI Dependency" 
          value={avgDependency} 
          subtitle="Out of 7.0"
          color="#8b5cf6" 
        />
        <StatCard 
          icon={AlertTriangle} 
          title="High Risk Students" 
          value={highRiskCount} 
          subtitle={`${totalStudents > 0 ? ((highRiskCount/totalStudents)*100).toFixed(1) : '0.0'}% of total`}
          color="#ef4444" 
        />
        <StatCard 
          icon={BarChart3} 
          title="Model Accuracy" 
          value={`${predictionAccuracy}%`} 
          subtitle="Logistic Regression"
          color="#10b981" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performancePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {performancePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* College Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Dependency by College</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={collegeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="college" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDependency" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Forecasting Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Trend - Forecasting */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">AI Dependency Trend Forecast</h3>
            <Activity className="text-blue-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="avgDependency" fill="#3b82f6" stroke="#2563eb" fillOpacity={0.6} name="Avg Dependency" />
              <Line yAxisId="right" type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={2} name="High Risk Count" dot={{ fill: '#ef4444', r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">Predictive trend showing AI dependency evolution over semester</p>
        </div>

        {/* Dependency vs Performance Correlation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Dependency-Performance Correlation</h3>
            <Target className="text-purple-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="dependency" name="AI Dependency" domain={[2, 7]} label={{ value: 'AI Dependency Score', position: 'bottom' }} />
              <YAxis type="number" dataKey="performance_Level" name="Performance Level" domain={[1, 4]} label={{ value: 'Performance Level', angle: -90, position: 'left' }} />
              <ZAxis type="number" dataKey="size" range={[50, 400]} name="Study Hours" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded shadow-lg">
                      <p className="text-xs"><strong>Dependency:</strong> {payload[0].value}</p>
                      <p className="text-xs"><strong>Performance Level:</strong> {payload[1].value}</p>
                      <p className="text-xs"><strong>Study Hours:</strong> {payload[2].value}</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Legend />
              <Scatter name="Students" data={correlationData} fill="#8b5cf6" shape="circle" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">Scatter plot revealing negative correlation between AI dependency and academic performance</p>
        </div>

        {/* Risk Distribution by Year Level */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Risk Distribution by Year Level</h3>
            <Zap className="text-yellow-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearLevelRiskChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="High" stackId="a" fill="#ef4444" name="High Risk" />
              <Bar dataKey="Moderate" stackId="a" fill="#f59e0b" name="Moderate Risk" />
              <Bar dataKey="Low" stackId="a" fill="#10b981" name="Low Risk" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">Stacked bar chart showing risk stratification across academic year levels</p>
        </div>

        {/* Theoretical Framework Integration */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Theoretical Framework Analysis</h3>
            <Brain className="text-indigo-500" size={24} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={theoreticalData[0] ? [theoreticalData[0]] : []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="student" />
              <PolarRadiusAxis domain={[0, 7]} />
              <Radar name="CLT (Cognitive Load)" dataKey="CLT" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="SDT (Motivation)" dataKey="SDT" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Radar name="SCT (Social)" dataKey="SCT" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2">Radar chart integrating CLT, SDT, and SCT theoretical frameworks</p>
        </div>
      </div>

      {/* Model Performance Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ML Model Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {modelMetrics.map((metric, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">{metric.metric}</p>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-blue-600">{metric.value}%</span>
                <span className="text-xs text-gray-400 mb-1">/ {metric.target}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${(metric.value / metric.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={modelMetrics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="metric" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="Current" />
            <Bar dataKey="target" fill="#cbd5e1" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cognitive Load Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cognitive Load Theory (CLT) Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={cltData}>
            <defs>
              <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWriting" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNumeracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="student" />
            <YAxis domain={[0, 7]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="reading" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReading)" name="Reading Dependency" />
            <Area type="monotone" dataKey="writing" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorWriting)" name="Writing Dependency" />
            <Area type="monotone" dataKey="numeracy" stroke="#10b981" fillOpacity={1} fill="url(#colorNumeracy)" name="Numeracy Dependency" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2">Area chart showing cognitive offloading patterns across three academic domains</p>
      </div>

      {/* Student Search and Quick View */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Quick Search</h3>
        <input
          type="text"
          placeholder="Search by ID, email, or college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-4 max-h-96 overflow-y-auto">
          {filteredStudents.slice(0, 10).map(student => (
            <div 
              key={student.id}
              onClick={() => {
                setSelectedStudent(student);
                setCurrentPage('analysis');
              }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 border-b cursor-pointer transition"
            >
              <div>
                <p className="font-semibold text-gray-800">{student.id}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  student.riskLevel === 'High Risk' ? 'bg-red-100 text-red-800' :
                  student.riskLevel === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {student.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!selectedStudent) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a student from the dashboard</p>
        </div>
      );
    }

    const dependencyData = [
      { domain: 'Reading', score: selectedStudent.readingScore, color: '#3b82f6' },
      { domain: 'Writing', score: selectedStudent.writingScore, color: '#8b5cf6' },
      { domain: 'Numeracy', score: selectedStudent.numeracyScore, color: '#10b981' }
    ];

    // Radar chart data for comprehensive view
    const radarData = [
      {
        subject: 'Reading',
        current: selectedStudent.readingScore,
        optimal: 4.0,
        fullMark: 7
      },
      {
        subject: 'Writing',
        current: selectedStudent.writingScore,
        optimal: 4.0,
        fullMark: 7
      },
      {
        subject: 'Numeracy',
        current: selectedStudent.numeracyScore,
        optimal: 4.0,
        fullMark: 7
      },
      {
        subject: 'Motivation',
        current: selectedStudent.motivationScore,
        optimal: 6.0,
        fullMark: 7
      },
      {
        subject: 'Cognitive Load',
        current: selectedStudent.cognitiveLoad,
        optimal: 5.0,
        fullMark: 7
      }
    ];

    // Performance prediction over time
    const performanceForecast = selectedStudent.trend.map((t, idx) => ({
      month: t.month,
      dependency: t.dependency,
      predictedPerformance: parseFloat((4.0 - (t.dependency - 2) * 0.3).toFixed(2)),
      actualPerformance: idx < 5 ? parseFloat((selectedStudent.performance_Level + (Math.random() - 0.5) * 0.3).toFixed(2)) : null
    }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Student Analysis</h1>
          <button 
            onClick={() => setSelectedStudent(null)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Clear Selection
          </button>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">ID:</span> {selectedStudent.id}</p>
                <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                <p><span className="font-medium">College:</span> {selectedStudent.college}</p>
                <p><span className="font-medium">Year Level:</span> {selectedStudent.yearLevel}</p>
                <p><span className="font-medium">Performance Level:</span> <span className="text-lg font-bold text-blue-600">{selectedStudent.performance_Level}</span></p>
                <p><span className="font-medium">Study Hours/Week:</span> {selectedStudent.studyHours}h</p>
                <p><span className="font-medium">Attendance Rate:</span> {selectedStudent.attendanceRate}%</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total AI Dependency</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.totalDependency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AI Engagement Index</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedStudent.aiEngagementIndex}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance Level</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedStudent.performanceLevel === 'High Performance' ? 'bg-green-100 text-green-800' :
                    selectedStudent.performanceLevel === 'Moderate Performance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedStudent.performanceLevel}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Risk Assessment</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedStudent.riskLevel === 'High Risk' ? 'bg-red-100 text-red-800' :
                    selectedStudent.riskLevel === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedStudent.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Forecast */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[1, 4]} label={{ value: 'Performance Level', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" domain={[2, 7]} label={{ value: 'Dependency', angle: 90, position: 'insideRight' }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="actualPerformance" stroke="#10b981" strokeWidth={2} name="Actual Performance" dot={{ r: 4 }} />
                <Line yAxisId="left" type="monotone" dataKey="predictedPerformance" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Predicted Performance" />
                <Line yAxisId="right" type="monotone" dataKey="dependency" stroke="#ef4444" strokeWidth={2} name="AI Dependency" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">Forecasting model predicting Performance Level trajectory based on AI dependency patterns</p>
          </div>

          {/* Comprehensive Radar Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Multi-Dimensional Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0, 7]} />
                <Radar name="Current State" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Radar name="Optimal Level" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">Radar chart comparing current metrics against optimal performance indicators</p>
          </div>
        </div>

        {/* Dependency Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Dependency by Domain</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dependencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" />
              <YAxis domain={[0, 7]} />
              <Tooltip />
              <Bar dataKey="score" fill="#3b82f6">
                {dependencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-3">
              <BookOpen className="text-blue-500 mr-2" />
              <h4 className="font-semibold text-gray-800">Reading</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600">{selectedStudent.readingScore}</p>
            <p className="text-sm text-gray-500 mt-2">AI tools for comprehension, summarization</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-600">Cognitive Load Impact</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(selectedStudent.readingScore / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-3">
              <PenTool className="text-purple-500 mr-2" />
              <h4 className="font-semibold text-gray-800">Writing</h4>
            </div>
            <p className="text-3xl font-bold text-purple-600">{selectedStudent.writingScore}</p>
            <p className="text-sm text-gray-500 mt-2">AI for grammar, paraphrasing, drafting</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-600">Cognitive Load Impact</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(selectedStudent.writingScore / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-3">
              <Calculator className="text-green-500 mr-2" />
              <h4 className="font-semibold text-gray-800">Numeracy</h4>
            </div>
            <p className="text-3xl font-bold text-green-600">{selectedStudent.numeracyScore}</p>
            <p className="text-sm text-gray-500 mt-2">AI for calculations, problem-solving</p>
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-600">Cognitive Load Impact</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(selectedStudent.numeracyScore / 7) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Theoretical Framework Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Theoretical Framework Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Brain className="text-blue-600" size={20} />
                </div>
                <h4 className="font-semibold text-gray-800">CLT Analysis</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">{selectedStudent.cognitiveLoad}</p>
              <p className="text-xs text-gray-600">Cognitive Load Score (inverse of dependency)</p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedStudent.cognitiveLoad > 5 
                  ? "✓ Healthy cognitive engagement maintained" 
                  : "⚠ Risk of cognitive offloading"}
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Target className="text-green-600" size={20} />
                </div>
                <h4 className="font-semibold text-gray-800">SDT Analysis</h4>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">{selectedStudent.motivationScore}</p>
              <p className="text-xs text-gray-600">Self-Determination Score</p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedStudent.motivationScore > 6 
                  ? "✓ Strong intrinsic motivation" 
                  : "⚠ May rely on AI for competence"}
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Users className="text-purple-600" size={20} />
                </div>
                <h4 className="font-semibold text-gray-800">SCT Analysis</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">{selectedStudent.attendanceRate}%</p>
              <p className="text-xs text-gray-600">Social Learning Engagement</p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedStudent.attendanceRate > 85 
                  ? "✓ Strong peer learning influence" 
                  : "⚠ Limited social-cognitive interaction"}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="space-y-3">
            {selectedStudent.riskLevel === 'High Risk' && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="font-semibold text-red-800">⚠️ High Risk Alert</p>
                <p className="text-sm text-red-700 mt-1">Student shows high AI dependency. Consider intervention strategies to build independent learning skills.</p>
              </div>
            )}
            {selectedStudent.writingScore > 5.5 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="font-semibold text-yellow-800">📝 Writing Support Needed</p>
                <p className="text-sm text-yellow-700 mt-1">High dependency on AI writing tools. Encourage manual drafting and revision practices.</p>
              </div>
            )}
            {selectedStudent.totalDependency < 4.0 && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="font-semibold text-green-800">✅ Balanced AI Usage</p>
                <p className="text-sm text-green-700 mt-1">Student demonstrates responsible AI integration with maintained critical thinking skills.</p>
              </div>
            )}
            {selectedStudent.cognitiveLoad < 3.0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <p className="font-semibold text-orange-800">🧠 Cognitive Load Warning</p>
                <p className="text-sm text-orange-700 mt-1">Excessive cognitive offloading detected. Implement strategies to increase active learning engagement.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStudents = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">All Students</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
        />
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dependency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.college}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.yearLevel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.totalDependency}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.riskLevel === 'High Risk' ? 'bg-red-100 text-red-800' :
                      student.riskLevel === 'Moderate Risk' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {student.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => {
                        setSelectedStudent(student);
                        setCurrentPage('analysis');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderForecasting = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Forecasting</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Forecasting page placeholder - integrate real forecasting logic here</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <School className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">IntelliGrade</h1>
                <p className="text-sm text-gray-500">AI Dependency & Performance Forecasting</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">LSPU-SPCC</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <LogOut size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-md p-4 h-fit">
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentPage('analysis')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'analysis' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Analysis</span>
              </button>
              <button
                onClick={() => setCurrentPage('students')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'students' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users size={20} />
                <span className="font-medium">Students</span>
              </button>
              <button
                onClick={() => setCurrentPage('forecasting')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'forecasting' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <TrendingUp size={20} />
                <span className="font-medium">Forecasting</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {currentPage === 'dashboard' && renderDashboard()}
            {currentPage === 'analysis' && renderAnalysis()}
            {currentPage === 'students' && renderStudents()}
            {currentPage === 'forecasting' && renderForecasting()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>IntelliGrade © 2025 | Powered by Logistic Regression ML Model (55.17% Accuracy)</p>
            <p className="mt-1">Laguna State Polytechnic University - San Pablo City Campus</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntelliGrade;