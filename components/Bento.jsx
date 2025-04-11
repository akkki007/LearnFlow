export default function Bento() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">
          Empowering Students with Seamless Coding & Practical Tracking
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tighter text-gray-950 sm:text-5xl">
          🚀 Code, Execute & Submit All in One Place!
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          {/* Card 1 - Mobile Friendly */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem] shadow-lg"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)] p-8 sm:p-10">
              <div className="mb-6">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-950">
                  Mobile-Friendly & Accessible
                </h3>
                <p className="mt-2 text-sm/6 text-gray-600">
                  Our platform is designed to be fully responsive, ensuring students can write, execute, and submit their practicals anytime, anywhere—right from their mobile devices!
                </p>
              </div>
              <div className="mt-auto">
                <div className="h-64 w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
                  <div className="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-indigo-600">Responsive Design</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Live Code Execution */}
          <div className="relative">
            <div className="absolute inset-px rounded-lg bg-white shadow-lg"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] p-8 sm:p-10">
              <div className="mb-6">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-950">
                  Live Code Execution
                </h3>
                <p className="mt-2 text-sm/6 text-gray-600">
                  No need for external software! Students can write and execute programs directly in the browser, making learning faster and more interactive.
                </p>
              </div>
              <div className="mt-auto">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex space-x-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <code className="text-green-400 text-sm">
                    {`console.log("Hello, World!");`}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - One-Click Submission */}
          <div className="relative">
            <div className="absolute inset-px rounded-lg bg-white shadow-lg"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] p-8 sm:p-10">
              <div className="mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-950">
                  One-Click Submission
                </h3>
                <p className="mt-2 text-sm/6 text-gray-600">
                  After execution, students can download their work or submit it directly to their teachers, eliminating manual uploads and email submissions.
                </p>
              </div>
              <div className="mt-auto">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Submit Practical
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Practical Tracking */}
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-[2rem] shadow-lg"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-r-[calc(2rem+1px)] p-8 sm:p-10">
              <div className="mb-6">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-gray-950">
                  Practical Tracking & Performance Monitoring
                </h3>
                <p className="mt-2 text-sm/6 text-gray-600">
                  Teachers can track students' progress, review submissions, and provide feedback, all in one centralized dashboard.
                </p>
              </div>
              <div className="mt-auto">
                <div className="bg-gray-900 rounded-xl p-4">
                  <div className="flex mb-4">
                    <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white text-sm">
                      Practical-1.jsx
                    </div>
                    <div className="border-r border-gray-600/10 px-4 py-2 text-gray-400 text-sm">
                      Practical-2.jsx
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-400">85% completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2/3 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '60%' }}></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-400">60% completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}