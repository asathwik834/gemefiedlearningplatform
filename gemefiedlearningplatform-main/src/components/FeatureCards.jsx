const FeatureCards = () => {
  const features = [
    {
      title: "Free STEM Content",
      description: "Access high-quality educational resources for all STEM subjects, completely free of charge.",
      icon: "\u{1F9EA}",
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Self-Paced Learning",
      description: "Learn at your own pace with interactive lessons and practice exercises tailored to your level.",
      icon: "\u{1F4DA}",
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Earn Badges & Certifications",
      description: "Get recognized for your achievements with digital badges and certificates upon course completion.",
      icon: "\u{1F3C6}",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      title: "Offline Access Support",
      description: "Download lessons and continue learning even without an internet connection.",
      icon: "\u{1F4F1}",
      color: "bg-green-100 text-green-800"
    }
  ];
  return <div className="bg-gray-50 py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center"><h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose SkillSprout?
          </h2><p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Empowering students with engaging STEM education, regardless of location or resources.
          </p></div><div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">{features.map((feature, index) => <div key={index} className="bg-white pt-6 px-6 pb-8 rounded-lg shadow-sm border border-gray-100"><div className={`${feature.color} h-12 w-12 rounded-full flex items-center justify-center text-2xl mb-4`}>{feature.icon}</div><h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3><p className="text-gray-600">{feature.description}</p></div>)}</div></div></div>;
};
export default FeatureCards;
