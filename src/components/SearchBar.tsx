import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim()) {
        fetch(`/api/search?query=${encodeURIComponent(search)}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setShowDropdown(true);
          });
      } else {
        setSearchResults(null);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
      setShowDropdown(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex items-center w-64 bg-gray-100 rounded-full focus-within:ring-2 focus-within:ring-blue-400 transition-all"
    >
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-transparent outline-none pl-4 pr-10 py-2 text-gray-700 text-sm"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => { if (searchResults) setShowDropdown(true); }}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      <button
        type="submit"
        className="absolute right-3 text-gray-400 hover:text-blue-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      {/* Optionally add dropdown for search results here */}
    </form>
  );
};

export default SearchBar; 