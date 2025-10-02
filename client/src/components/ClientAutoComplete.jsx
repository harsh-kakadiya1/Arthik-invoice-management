import React, { useState, useEffect, useRef } from 'react';
import { useClients } from '../context/ClientContext';
import { FiSearch, FiUser, FiMail, FiPhone, FiMapPin, FiPlus } from 'react-icons/fi';

const ClientAutoComplete = ({ 
  onClientSelect, 
  onNewClient, 
  placeholder = "Search or add client...",
  value = "",
  onChange
}) => {
  const { searchClients } = useClients();
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onChange && onChange(newQuery);

    if (newQuery.trim().length >= 1) {
      setLoading(true);
      try {
        const results = await searchClients(newQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error searching clients:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClientSelect = (client) => {
    setQuery(client.name);
    setShowSuggestions(false);
    onClientSelect && onClientSelect(client);
  };

  const handleNewClient = () => {
    setShowSuggestions(false);
    onNewClient && onNewClient(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 h-4 w-4 text-light-text-secondary" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 1 && setShowSuggestions(true)}
          className="form-input w-full pl-10"
          placeholder={placeholder}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="spinner h-4 w-4"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-border-primary rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((client) => (
                <div
                  key={client._id}
                  onClick={() => handleClientSelect(client)}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-border-primary last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <FiUser className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {client.name}
                      </div>
                      <div className="space-y-1 mt-1">
                        {client.email && (
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <FiMail className="mr-1 h-3 w-3" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <FiPhone className="mr-1 h-3 w-3" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {(client.address || client.city) && (
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <FiMapPin className="mr-1 h-3 w-3" />
                            <span className="truncate">
                              {client.address && client.city 
                                ? `${client.address}, ${client.city}`
                                : client.address || client.city
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add New Client Option */}
              <div
                onClick={handleNewClient}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-t border-border-primary bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-center space-x-2 text-brand-primary">
                  <FiPlus className="h-4 w-4" />
                  <span className="font-medium">Add new client: "{query}"</span>
                </div>
              </div>
            </>
          ) : query.trim().length >= 1 ? (
            <div className="p-3">
              <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <FiUser className="h-4 w-4" />
                <span>No clients found</span>
              </div>
              <div
                onClick={handleNewClient}
                className="mt-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded border border-brand-primary border-dashed"
              >
                <div className="flex items-center space-x-2 text-brand-primary">
                  <FiPlus className="h-4 w-4" />
                  <span className="font-medium">Add "{query}" as new client</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ClientAutoComplete;
