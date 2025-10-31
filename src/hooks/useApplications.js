import { useState, useEffect } from 'react';
import { supabase, storage } from '../lib/supabase';

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setApplications(data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const uploadLogo = async (file) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('application-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('application-logos')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading logo:', err);
      throw err;
    }
  };

  const createApplication = async (applicationData) => {
    try {
      setError(null);

      const slug = generateSlug(applicationData.name);

      const { data: existing } = await supabase
        .from('applications')
        .select('slug')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        throw new Error(`Já existe um aplicativo com o slug "${slug}"`);
      }

      if (applicationData.domain) {
        const { data: existingDomain } = await supabase
          .from('applications')
          .select('domain')
          .eq('domain', applicationData.domain)
          .maybeSingle();

        if (existingDomain) {
          throw new Error(`O domínio "${applicationData.domain}" já está em uso`);
        }
      }

      const { data, error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            name: applicationData.name,
            slug: slug,
            logo_url: applicationData.logo_url || '',
            description: applicationData.description || '',
            domain: applicationData.domain || null,
            status: 'active'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      await loadApplications();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating application:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateApplication = async (id, applicationData) => {
    try {
      setError(null);

      if (applicationData.domain) {
        const { data: existingDomain } = await supabase
          .from('applications')
          .select('id, domain')
          .eq('domain', applicationData.domain)
          .maybeSingle();

        if (existingDomain && existingDomain.id !== id) {
          throw new Error(`O domínio "${applicationData.domain}" já está em uso`);
        }
      }

      const updateData = {
        name: applicationData.name,
        logo_url: applicationData.logo_url,
        description: applicationData.description,
        domain: applicationData.domain || null,
        updated_at: new Date().toISOString()
      };

      const { data, error: updateError } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await loadApplications();
      return { success: true, data };
    } catch (err) {
      console.error('Error updating application:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteApplication = async (id) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await loadApplications();
      return { success: true };
    } catch (err) {
      console.error('Error deleting application:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setError(null);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) throw updateError;

      await loadApplications();
      return { success: true };
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    toggleStatus,
    uploadLogo,
    refreshApplications: loadApplications
  };
}
