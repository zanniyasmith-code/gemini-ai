import { AppTheme } from '../types';

export const THEMES: Record<string, AppTheme> = {
  normal: {
    name: 'normal',
    label: 'Normal',
    description: 'Everyday clean & light',
    isDark: false,
    colors: {
      background: '#F8FAFC', // Slate 50
      surface: '#FFFFFF',
      primary: '#3B82F6', // Blue 500
      secondary: '#E2E8F0', // Slate 200
      accent: '#64748B', // Slate 500
      text: '#0F172A', // Slate 900
      muted: '#64748B', // Slate 500
      border: '#CBD5E1', // Slate 300
      display: '#F1F5F9', // Slate 100
      danger: '#EF4444', // Red 500
    },
  },
  business: {
    name: 'business',
    label: 'Business',
    description: 'Corporate focus',
    isDark: false,
    colors: {
      background: '#F1F5F9', // Slate 100
      surface: '#FFFFFF',
      primary: '#0F172A', // Navy (Slate 900)
      secondary: '#E2E8F0',
      accent: '#F97316', // Orange 500
      text: '#1E293B',
      muted: '#94A3B8',
      border: '#CBD5E1',
      display: '#E2E8F0',
      danger: '#EF4444',
    },
  },
  investment: {
    name: 'investment',
    label: 'Investment',
    description: 'Growth & wealth',
    isDark: false,
    colors: {
      background: '#F0FDF4', // Green 50
      surface: '#FFFFFF',
      primary: '#15803D', // Green 700
      secondary: '#DCFCE7', // Green 100
      accent: '#10B981', // Emerald 500
      text: '#064E3B', // Green 900
      muted: '#65A30D',
      border: '#86EFAC',
      display: '#DCFCE7',
      danger: '#EF4444',
    },
  },
  professional: {
    name: 'professional',
    label: 'Professional',
    description: 'Dark mode pro',
    isDark: true,
    colors: {
      background: '#020617', // Slate 950
      surface: '#1E293B', // Slate 800
      primary: '#38BDF8', // Sky 400
      secondary: '#334155', // Slate 700
      accent: '#0EA5E9', // Sky 500
      text: '#F8FAFC', // Slate 50
      muted: '#94A3B8', // Slate 400
      border: '#1E293B', // Slate 800
      display: '#0F172A', // Slate 900
      danger: '#EF4444',
    },
  },
  premiumGold: {
    name: 'premiumGold',
    label: 'Premium Gold',
    description: 'Luxury wealth',
    isDark: true,
    colors: {
      background: '#101318', // Rich Black
      surface: '#181C24', // Dark Charcoal
      primary: '#D4AF37', // Gold
      secondary: '#272B36', // Darker Grey
      accent: '#FFCA28', // Soft Amber/Gold
      text: '#FFFFFF',
      muted: '#B0B0B0', // Silverish
      border: '#333741',
      display: '#0A0C0F',
      danger: '#CF352E',
    },
  },
  neonTech: {
    name: 'neonTech',
    label: 'Neon Tech',
    description: 'Gaming & Cyberpunk',
    isDark: true,
    colors: {
      background: '#050711', // Deep Space
      surface: '#0B1020', // Dark Blue-Black
      primary: '#00E5FF', // Neon Cyan
      secondary: '#1A237E', // Deep Indigo
      accent: '#FF4081', // Neon Pink
      text: '#FFFFFF',
      muted: '#9FA8DA',
      border: '#1F2940',
      display: '#020305',
      danger: '#FF1744',
    },
  },
};