import { Link } from "react-router-dom";
const CoursesSection = () => {
  const courses = [
    {
      id: "math",
      title: "Mathematics",
      description: "Master mathematical concepts from basic arithmetic to advanced calculus.",
      level: "Beginner to Advanced",
      icon: "\u{1F9EE}",
      color: "bg-red-100 text-red-800"
    },
    {
      id: "physics",
      title: "Physics",
      description: "Explore the fundamental principles of matter, energy, and the universe.",
      level: "Class 6-12",
      icon: "\u269B\uFE0F",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Discover the composition, structure, and properties of matter.",
      level: "Class 6-12",
      icon: "\u{1F9EA}",
      color: "bg-green-100 text-green-800"
    },
    {
      id: "biology",
      title: "Biology",
      description: "Study living organisms and their vital processes.",
      level: "Class 6-12",
      icon: "\u{1F9EC}",
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: "computer-science",
      title: "Computer Science",
      description: "Learn programming, algorithms, and computational thinking.",
      level: "Beginner to Advanced",
      icon: "\u{1F4BB}",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      id: "robotics",
      title: "Robotics",
      description: "Introduction to robotics and automation concepts.",
      level: "Intermediate",
      icon: "\u{1F916}",
      color: "bg-indigo-100 text-indigo-800"
    }
  ];
  return <section id="courses" className="py-16 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center"><h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Explore Our Courses
          </h2><p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Comprehensive STEM courses designed for classes 6-12
          </p></div><div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{courses.map((course) => <div
    key={course.id}
    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
  ><div className="p-6"><div className={`${course.color} h-16 w-16 rounded-lg flex items-center justify-center text-3xl mb-4`}>{course.icon}</div><h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3><p className="text-gray-600 mb-4">{course.description}</p><div className="flex justify-between items-center"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{course.level}</span><Link
    to={`/courses/${course.id}`}
    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
  >
                    Learn more →
                  </Link></div></div></div>)}</div><div className="mt-12 text-center"><Link
    to="/courses"
    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
            View All Courses
          </Link></div></div></section>;
};
export default CoursesSection;
