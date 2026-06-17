const PartnersSection = () => {
  const partners = [
    { name: "Ministry of Education", logo: "\u{1F3DB}\uFE0F" },
    { name: "Digital India", logo: "\u{1F1EE}\u{1F1F3}" },
    { name: "STEM Foundation", logo: "\u{1F52C}" },
    { name: "EduTech Partners", logo: "\u{1F4A1}" }
  ];
  return <section className="py-16 bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="text-center mb-12"><h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Partners & Supporters
          </h2><p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Collaborating with leading organizations to bring quality education to all
          </p></div><div className="grid grid-cols-2 gap-8 md:grid-cols-4">{partners.map((partner, index) => <div key={index} className="flex flex-col items-center"><div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm border border-gray-200">{partner.logo}</div><h3 className="mt-4 text-lg font-medium text-gray-900">{partner.name}</h3></div>)}</div></div></section>;
};
export default PartnersSection;
