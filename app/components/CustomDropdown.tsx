"use Client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
}: Props) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* 트리거 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full bg-zinc-800 text-zinc-300 rounded-lg px-4 py-2 flex items-center justify-between hover:bg-zinc-700 transition focus:ring-2 focus:ring-primary"
      >
        <span className={selected ? "" : "text-zinc-500"}>
          {selected ? selected.label : placeholder}
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* 드롭다운 */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden"
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer flex items-center justify-between transition ${isSelected ? "bg-zinc-800 text-white" : "hover:bg-zinc-800"}
`}
                >
                  <span>{option.label}</span>

                  {isSelected && <Check size={16} className="text-primary" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
