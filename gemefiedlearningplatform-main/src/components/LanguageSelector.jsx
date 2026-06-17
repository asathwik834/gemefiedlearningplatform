import { Globe } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  const languages = [
    { code: "en", name: "English", flag: "\u{1F1EC}\u{1F1E7}" },
    { code: "hi", name: "\u0939\u093F\u0902\u0926\u0940", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "te", name: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", flag: "\u{1F1EE}\u{1F1F3}" },
    { code: "or", name: "\u0B13\u0B21\u0B3C\u0B3F\u0B06", flag: "\u{1F1EE}\u{1F1F3}" }
  ];
  return <div className="relative group"><select
    value={currentLanguage}
    onChange={(e) => changeLanguage(e.target.value)}
    className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
  >{languages.map((lang) => <option key={lang.code} value={lang.code} className="text-gray-800">{lang.flag} {lang.name}</option>)}</select><Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600" /><div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 group-hover:text-indigo-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg></div></div>;
};
export default LanguageSelector;
