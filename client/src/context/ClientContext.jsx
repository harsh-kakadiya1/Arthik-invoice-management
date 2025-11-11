import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const ClientContext = createContext();

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // Search clients by name
  const searchClients = async (query) => {
    if (!query || query.trim().length < 1) {
      return [];
    }
    
    try {
      const response = await api.get(`/clients/search?q=${encodeURIComponent(query)}`);
      return response.data.data;
    } catch (err) {
      console.error('Error searching clients:', err);
      return [];
    }
  };

  // Create new client
  const createClient = async (clientData) => {
    try {
      setLoading(true);
      const response = await api.post('/clients', clientData);
      setClients(prev => [...prev, response.data.data]);
      setError(null);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create client';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update client
  const updateClient = async (clientId, clientData) => {
    try {
      setLoading(true);
      const response = await api.put(`/clients/${clientId}`, clientData);
      setClients(prev => prev.map(client => 
        client._id === clientId ? response.data.data : client
      ));
      setError(null);
      return response.data.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update client';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete client
  const deleteClient = async (clientId) => {
    try {
      setLoading(true);
      await api.delete(`/clients/${clientId}`);
      setClients(prev => prev.filter(client => client._id !== clientId));
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete client';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  const value = {
    clients,
    loading,
    error,
    fetchClients,
    searchClients,
    createClient,
    updateClient,
    deleteClient
  };

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};
