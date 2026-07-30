import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CARD_H, CARD_W, MAX_SCALE, MIN_SCALE } from '../data/canvas';
import { RESULT_POOL } from '../data/searchPool';
import { SAMPLE_ITEMS } from '../data/sampleData';
import { Connection, MediaItem, MediaType, Status, MEDIA_TYPES } from '../data/types';
import { cancelReminder, scheduleReminder } from '../lib/notifications';

type Overlay = 'save' | 'detail' | 'export' | null;

interface Point {
  x: number;
  y: number;
}

interface TempLine {
  fromId: string;
  x: number;
  y: number;
}

interface WeaveState {
  items: MediaItem[];
  connections: Connection[];
  activeFilters: MediaType[];

  view: 'list' | 'canvas';
  overlay: Overlay;
  selectedItemId: string | null;
  searchQuery: string;
  searchType: MediaType;

  canvasScale: number;
  canvasOffset: Point;
  sidebarOpen: boolean;
  tempLine: TempLine | null;
  editingConnectionId: string | null;

  setView: (view: 'list' | 'canvas') => void;
  openSave: () => void;
  openDetail: (id: string) => void;
  openExport: () => void;
  closeOverlay: () => void;

  toggleFilter: (type: MediaType) => void;
  setSearchQuery: (q: string) => void;
  setSearchType: (t: MediaType) => void;

  setStatus: (id: string, status: Status) => void;
  setRating: (id: string, rating: number) => void;
  deleteItem: (id: string) => void;
  placeOnCanvas: (id: string) => void;
  removeFromCanvas: (id: string) => void;
  addFromSearch: (title: string, subtitle: string) => void;
  setReminder: (id: string, whenMs: number) => void;
  clearReminder: (id: string) => void;

  moveItem: (id: string, x: number, y: number) => void;
  toggleSidebar: () => void;
  setCanvasTransform: (scale: number, offset: Point) => void;
  zoomBy: (delta: number, anchor?: Point) => void;
  fitToScreen: (viewportW: number, viewportH: number) => void;
  setTempLine: (line: TempLine | null) => void;
  addConnection: (from: string, to: string) => void;
  updateConnectionLabel: (id: string, label: string) => void;
  removeConnection: (id: string) => void;
  startEditConnection: (id: string) => void;
  stopEditConnection: () => void;
}

export const useWeaveStore = create<WeaveState>()(
  persist(
    (set, get) => ({
      items: SAMPLE_ITEMS,
      connections: [],
      activeFilters: MEDIA_TYPES,

      view: 'list',
      overlay: null,
      selectedItemId: null,
      searchQuery: '',
      searchType: 'movie',

      canvasScale: 1,
      canvasOffset: { x: 40, y: 40 },
      sidebarOpen: true,
      tempLine: null,
      editingConnectionId: null,

      setView: (view) => set({ view }),
      openSave: () => set({ overlay: 'save', searchQuery: '' }),
      openDetail: (id) => set({ overlay: 'detail', selectedItemId: id }),
      openExport: () => set({ overlay: 'export' }),
      closeOverlay: () => set({ overlay: null, editingConnectionId: null }),

      toggleFilter: (type) =>
        set((s) => ({
          activeFilters: s.activeFilters.includes(type)
            ? s.activeFilters.filter((t) => t !== type)
            : [...s.activeFilters, type],
        })),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSearchType: (searchType) => set({ searchType }),

      setStatus: (id, status) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, status } : i)) })),
      setRating: (id, rating) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, rating } : i)) })),
      deleteItem: (id) => {
        cancelReminder(id);
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
          connections: s.connections.filter((c) => c.from !== id && c.to !== id),
          overlay: null,
          selectedItemId: null,
        }));
      },
      placeOnCanvas: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id
              ? { ...i, placed: true, x: 40 + Math.random() * 120, y: 40 + Math.random() * 120 }
              : i
          ),
        })),
      removeFromCanvas: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, placed: false } : i)),
          connections: s.connections.filter((c) => c.from !== id && c.to !== id),
        })),
      addFromSearch: (title, subtitle) => {
        const type = get().searchType;
        const id = 'i' + Math.random().toString(36).slice(2, 10);
        set((s) => ({
          items: [
            ...s.items,
            { id, type, title, subtitle, status: 'want', rating: null, placed: false, x: 0, y: 0, reminderAt: null },
          ],
          overlay: null,
          searchQuery: '',
        }));
      },
      setReminder: (id, whenMs) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, reminderAt: whenMs } : i)) }));
        scheduleReminder(id, item.title, whenMs);
      },
      clearReminder: (id) => {
        cancelReminder(id);
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, reminderAt: null } : i)) }));
      },

      moveItem: (id, x, y) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, x, y } : i)) })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCanvasTransform: (scale, offset) => set({ canvasScale: scale, canvasOffset: offset }),
      zoomBy: (delta, anchor) =>
        set((s) => {
          const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, s.canvasScale + delta));
          if (!anchor) return { canvasScale: newScale };
          // Keep the point under `anchor` visually fixed while zooming.
          const worldX = (anchor.x - s.canvasOffset.x) / s.canvasScale;
          const worldY = (anchor.y - s.canvasOffset.y) / s.canvasScale;
          return {
            canvasScale: newScale,
            canvasOffset: { x: anchor.x - worldX * newScale, y: anchor.y - worldY * newScale },
          };
        }),
      fitToScreen: (viewportW, viewportH) => {
        const placed = get().items.filter((i) => i.placed);
        if (!placed.length) {
          set({ canvasScale: 1, canvasOffset: { x: 40, y: 40 } });
          return;
        }
        const minX = Math.min(...placed.map((i) => i.x));
        const minY = Math.min(...placed.map((i) => i.y));
        const maxX = Math.max(...placed.map((i) => i.x + CARD_W));
        const maxY = Math.max(...placed.map((i) => i.y + CARD_H));
        const cw = maxX - minX;
        const ch = maxY - minY;
        const pad = 60;
        const newScale = Math.min(
          MAX_SCALE,
          Math.max(MIN_SCALE, Math.min((viewportW - 2 * pad) / cw, (viewportH - 2 * pad) / ch))
        );
        const offset = {
          x: pad - minX * newScale + Math.max(0, (viewportW - 2 * pad - cw * newScale) / 2),
          y: pad - minY * newScale + Math.max(0, (viewportH - 2 * pad - ch * newScale) / 2),
        };
        set({ canvasScale: newScale, canvasOffset: offset });
      },
      setTempLine: (tempLine) => set({ tempLine }),
      addConnection: (from, to) => {
        if (from === to) return;
        const exists = get().connections.some((c) => c.from === from && c.to === to);
        if (exists) return;
        const id = 'c' + Math.random().toString(36).slice(2, 10);
        set((s) => ({
          connections: [...s.connections, { id, from, to, label: '' }],
          editingConnectionId: id,
        }));
      },
      updateConnectionLabel: (id, label) =>
        set((s) => ({ connections: s.connections.map((c) => (c.id === id ? { ...c, label } : c)) })),
      removeConnection: (id) =>
        set((s) => ({
          connections: s.connections.filter((c) => c.id !== id),
          editingConnectionId: s.editingConnectionId === id ? null : s.editingConnectionId,
        })),
      startEditConnection: (id) => set({ editingConnectionId: id }),
      stopEditConnection: () => set({ editingConnectionId: null }),
    }),
    {
      name: 'weave-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ items: s.items, connections: s.connections, activeFilters: s.activeFilters }),
    }
  )
);

export function searchResults(type: MediaType, query: string) {
  const q = query.trim().toLowerCase();
  return RESULT_POOL[type].filter((r) => !q || r.title.toLowerCase().includes(q));
}
