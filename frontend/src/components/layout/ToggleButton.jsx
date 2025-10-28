import { useTheme } from "../../context/ThemesContext";
import { Sun, Moon } from "lucide-react"; // ShadCN icons

export default function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
