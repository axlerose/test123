// src/contexts/RehearsalContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { RehearsalApiService } from '../services/rehearsalService';
import { RehearsalResponseDto, RehearsalRequestDto, Page, PageableParams } from '../types/api';

interface RehearsalContextType {
  rehearsalsPage: Page<RehearsalResponseDto> | null;
  currentRehearsal: RehearsalResponseDto | null;
  isLoadingRehearsals: boolean;
  rehearsalsError: string | null;
  fetchRehearsals: (start?: string, end?: string, pageable?: PageableParams) => Promise<void>;
  fetchRehearsalById: (id: number) => Promise<void>;
  addRehearsal: (rehearsalData: RehearsalRequestDto) => Promise<RehearsalResponseDto | null>;
  updateRehearsalState: (id: number, rehearsalData: RehearsalRequestDto) => Promise<RehearsalResponseDto | null>;
  removeRehearsal: (id: number) => Promise<void>;
  clearCurrentRehearsal: () => void;
}

const RehearsalContext = createContext<RehearsalContextType | undefined>(undefined);

export const RehearsalProvider = ({ children }: { children: ReactNode }) => {
  const [rehearsalsPage, setRehearsalsPage] = useState<Page<RehearsalResponseDto> | null>(null);
  const [currentRehearsal, setCurrentRehearsal] = useState<RehearsalResponseDto | null>(null);
  const [isLoadingRehearsals, setIsLoadingRehearsals] = useState(false);
  const [rehearsalsError, setRehearsalsError] = useState<string | null>(null);

  const fetchRehearsals = useCallback(async (start?: string, end?: string, pageable?: PageableParams) => {
    setIsLoadingRehearsals(true);
    setRehearsalsError(null);
    try {
      const data = await RehearsalApiService.getAllRehearsals(start, end, pageable);
      setRehearsalsPage(data);
    } catch (error: any) {
      setRehearsalsError(error.message || 'Failed to fetch rehearsals');
      console.error("RehearsalContext: Failed to fetch rehearsals", error);
    } finally {
      setIsLoadingRehearsals(false);
    }
  }, []);

  const fetchRehearsalById = useCallback(async (id: number) => {
    setIsLoadingRehearsals(true);
    setRehearsalsError(null);
    setCurrentRehearsal(null);
    try {
      const data = await RehearsalApiService.getRehearsalById(id);
      setCurrentRehearsal(data);
    } catch (error: any) {
      setRehearsalsError(error.message || `Failed to fetch rehearsal ${id}`);
       console.error(`RehearsalContext: Failed to fetch rehearsal ${id}`, error);
    } finally {
      setIsLoadingRehearsals(false);
    }
  }, []);
  
  const clearCurrentRehearsal = () => {
    setCurrentRehearsal(null);
  };

  const addRehearsal = async (rehearsalData: RehearsalRequestDto): Promise<RehearsalResponseDto | null> => {
    setIsLoadingRehearsals(true);
    try {
      const newRehearsal = await RehearsalApiService.createRehearsal(rehearsalData);
      if (rehearsalsPage?.number !== undefined) {
         await fetchRehearsals(undefined, undefined, { page: rehearsalsPage.number, size: rehearsalsPage.size });
      } else {
         await fetchRehearsals();
      }
      return newRehearsal;
    } catch (error: any) {
      setRehearsalsError(error.message || 'Failed to add rehearsal');
      console.error("RehearsalContext: Failed to add rehearsal", error);
      return null;
    } finally {
      setIsLoadingRehearsals(false);
    }
  };
  
  const updateRehearsalState = async (id: number, rehearsalData: RehearsalRequestDto): Promise<RehearsalResponseDto | null> => {
    setIsLoadingRehearsals(true);
    try {
        const updatedRehearsal = await RehearsalApiService.updateRehearsal(id, rehearsalData);
        if (currentRehearsal?.id === id) {
            setCurrentRehearsal(updatedRehearsal);
        }
        if (rehearsalsPage) {
            const newContent = rehearsalsPage.content.map(r => r.id === id ? updatedRehearsal : r);
            setRehearsalsPage({ ...rehearsalsPage, content: newContent });
        }
        return updatedRehearsal;
    } catch (error: any) {
        setRehearsalsError(error.message || 'Failed to update rehearsal');
        console.error("RehearsalContext: Failed to update rehearsal", error);
        return null;
    } finally {
        setIsLoadingRehearsals(false);
    }
  };

  const removeRehearsal = async (id: number): Promise<void> => {
    setIsLoadingRehearsals(true);
    try {
      await RehearsalApiService.deleteRehearsal(id);
      if (rehearsalsPage) {
         setRehearsalsPage(prev => prev ? ({
            ...prev,
            content: prev.content.filter(r => r.id !== id),
            totalElements: prev.totalElements -1
        }) : null);
      }
    } catch (error: any) {
      setRehearsalsError(error.message || 'Failed to delete rehearsal');
      console.error("RehearsalContext: Failed to delete rehearsal", error);
    } finally {
      setIsLoadingRehearsals(false);
    }
  };

  return (
    <RehearsalContext.Provider value={{ rehearsalsPage, currentRehearsal, isLoadingRehearsals, rehearsalsError, fetchRehearsals, fetchRehearsalById, addRehearsal, updateRehearsalState, removeRehearsal, clearCurrentRehearsal }}>
      {children}
    </RehearsalContext.Provider>
  );
};

export const useRehearsals = () => {
  const context = useContext(RehearsalContext);
  if (context === undefined) {
    throw new Error('useRehearsals must be used within a RehearsalProvider');
  }
  return context;
};
