interface Language {
  name: string;
  value: string;
  version: string;
}

const LANGUAGES: Language[] = [
  { name: 'JavaScript', value: 'javascript', version: '18.15.0' },
  { name: 'Python', value: 'python', version: '3.10.0' },
  { name: 'Java', value: 'java', version: '15.0.2' },
  { name: 'C++', value: 'cpp', version: '10.2.0' },
  { name: 'C', value: 'c', version: '10.2.0' },
  { name: 'Go', value: 'go', version: '1.16.2' },
  { name: 'Rust', value: 'rust', version: '1.68.2' },
  { name: 'TypeScript', value: 'typescript', version: '5.0.3' },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export { LANGUAGES };
