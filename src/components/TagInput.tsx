import useRandomColor from "@/src/hooks/useRandomColor";
import { Tag } from "@/types";
import React, { useState, useMemo, useRef, useEffect } from "react";

interface TagInputProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  placeholder: string;
  allTags: Tag[];
}

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  setTags,
  placeholder,
  allTags,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { generateRandomHexColor } = useRandomColor();

  const availableSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const lowerInputValue = inputValue.trim().toLowerCase();
    return allTags
      .filter(
        (tag) =>
          !tags.includes(tag) &&
          tag.title.toLowerCase().includes(lowerInputValue)
      )
      .slice(0, 7); // Show up to 7 suggestions
  }, [inputValue, allTags, tags]);

  const addTag = (tagToAdd: Tag) => {
    const newTag = {
      title: tagToAdd.title.trim().toLowerCase(),
      color: tagToAdd.color,
    };
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputValue("");
    setSuggestionsVisible(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: Tag) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter": {
        e.preventDefault();
        if (highlightedIndex > -1 && availableSuggestions[highlightedIndex]) {
          addTag(availableSuggestions[highlightedIndex]);
        } else if (inputValue.trim() !== "") {
          addTag({ title: inputValue, color: generateRandomHexColor() });
        }
        break;
      }
      case "Backspace": {
        if (inputValue === "" && tags.length > 0) {
          e.preventDefault();
          removeTag(tags[tags.length - 1]);
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        if (suggestionsVisible && availableSuggestions.length > 0) {
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, availableSuggestions.length - 1)
          );
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (suggestionsVisible && availableSuggestions.length > 0) {
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        }
        break;
      }
      case "Escape": {
        setSuggestionsVisible(false);
        setHighlightedIndex(-1);
        break;
      }
      default:
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(-1);
    if (!suggestionsVisible) {
      setSuggestionsVisible(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 flex items-center flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`flex items-center gap-1.5 text-white text-sm font-semibold px-2 py-1 rounded bg-[${tag.color}]`}
          >
            {tag.title}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-white/70 hover:text-white"
              aria-label={`Remove ${tag} tag`}
            >
              <XIcon />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id="tag-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setSuggestionsVisible(true)}
          className="flex-grow bg-transparent text-white outline-none p-1 min-w-[120px]"
          placeholder={tags.length === 0 ? placeholder : ""}
          aria-label="Add a new tag"
          autoComplete="off"
        />
      </div>
      {suggestionsVisible && availableSuggestions.length > 0 && (
        <ul
          className={`absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto`}
        >
          {availableSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.title}
              className={`px-3 py-2 cursor-pointer text-slate-300 hover:bg-slate-700 ${
                index === highlightedIndex ? suggestion.color : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(suggestion);
              }}
            >
              <span className={`bg-[${suggestion.color}] p-2 rounded-md`}>
                {suggestion.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
