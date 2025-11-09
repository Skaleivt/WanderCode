import css from "../SearchBox/SearchBox.module.css";

interface SearchBoxProps {
  onChange: (query: string) => void;
  value: string;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
  );
}
