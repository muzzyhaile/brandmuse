import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  onboarded: boolean;
  strategy_completed: boolean;
  strategy_data: any;
}

export interface Board {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
}

export interface Content {
  id: string;
  created_at: string;
  updated_at: string;
  board_id: string;
  title: string;
  description: string | null;
  content_type: string | null;
  status: string;
  published_at: string | null;
}

// User functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function isStrategyCompleted(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('strategy_completed')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data.strategy_completed || false;
}

export async function markStrategyCompleted(userId: string, strategyData: any) {
  const { data, error } = await supabase
    .from('users')
    .update({
      strategy_completed: true,
      strategy_data: strategyData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Board functions
export async function getUserBoards(userId: string) {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createBoard(board: Omit<Board, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('boards')
    .insert(board)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateBoard(boardId: string, updates: Partial<Board>) {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteBoard(boardId: string) {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId);
    
  if (error) throw error;
}

// Content functions
export async function getBoardContent(boardId: string) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function createContent(content: Omit<Content, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('content')
    .insert(content)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateContent(contentId: string, updates: Partial<Content>) {
  const { data, error } = await supabase
    .from('content')
    .update(updates)
    .eq('id', contentId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteContent(contentId: string) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', contentId);
    
  if (error) throw error;
}