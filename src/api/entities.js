import { HybridQuizResult } from '../entities/HybridQuizResult';
import { supabase } from '../lib/supabase';

export const QuizResult = HybridQuizResult;

export const Sale = {
  async list(orderBy = '-created_date') {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_date', { ascending: orderBy.startsWith('+') });
    if (error) throw error;
    return data || [];
  },
  async filter(filters, orderBy) {
    let query = supabase.from('sales').select('*');
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    if (orderBy) query = query.order('created_date', { ascending: orderBy.startsWith('+') });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async delete(id) {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) throw error;
  }
};

export const ManualSales = {
  async filter(filters) {
    let query = supabase.from('manual_sales').select('*');
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async create(data) {
    const { data: result, error } = await supabase.from('manual_sales').insert([data]);
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { error } = await supabase.from('manual_sales').update(data).eq('id', id);
    if (error) throw error;
  },
  async delete(id) {
    const { error } = await supabase.from('manual_sales').delete().eq('id', id);
    if (error) throw error;
  }
};

export const ManualCheckout = {
  async filter(filters) {
    let query = supabase.from('manual_checkout').select('*');
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async create(data) {
    const { data: result, error } = await supabase.from('manual_checkout').insert([data]);
    if (error) throw error;
    return result;
  },
  async update(id, data) {
    const { error } = await supabase.from('manual_checkout').update(data).eq('id', id);
    if (error) throw error;
  },
  async delete(id) {
    const { error } = await supabase.from('manual_checkout').delete().eq('id', id);
    if (error) throw error;
  }
};

export const UpsellView = {
  async list(orderBy = '-created_date') {
    const { data, error } = await supabase
      .from('upsell_views')
      .select('*')
      .order('created_date', { ascending: orderBy.startsWith('+') });
    if (error) throw error;
    return data || [];
  },
  async filter(filters) {
    let query = supabase.from('upsell_views').select('*');
    Object.keys(filters).forEach(key => {
      query = query.eq(key, filters[key]);
    });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
};
