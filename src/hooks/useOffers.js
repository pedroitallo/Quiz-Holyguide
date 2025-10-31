import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const createOffer = async (offerData) => {
    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('offers')
        .insert([
          {
            application_id: offerData.application_id,
            name: offerData.name,
            description: offerData.description || '',
            price: offerData.price || 0,
            currency: offerData.currency || 'BRL',
            checkouts: offerData.checkouts || [],
            status: 'active'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      await loadOffers();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating offer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateOffer = async (id, offerData) => {
    try {
      setError(null);

      const updateData = {
        application_id: offerData.application_id,
        name: offerData.name,
        description: offerData.description || '',
        price: offerData.price || 0,
        currency: offerData.currency || 'BRL',
        checkouts: offerData.checkouts || [],
        updated_at: new Date().toISOString()
      };

      const { data, error: updateError } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await loadOffers();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating offer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteOffer = async (id) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('offers')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadOffers();
      return { success: true };
    } catch (err) {
      console.error('Error deleting offer:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    offers,
    loading,
    error,
    createOffer,
    updateOffer,
    deleteOffer,
    refreshOffers: loadOffers
  };
}
