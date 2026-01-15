export interface PopupConfig {
  id: number;
  name: string;
  eventName: string;
  maxTickets: number;
  maxTicketsPerIP: number;
  date: string;
  time: string;
  location: string;
  backgroundImage: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const POPUP_CONFIGS: Record<number, PopupConfig> = {
  1: {
    id: 1,
    name: 'Chris Stussy',
    eventName: 'POP UP CHRIS STUSSY',
    maxTickets: 300,
    maxTicketsPerIP: 5,
    date: '17-01-26',
    time: '19.00 - 20.00 HS',
    location: 'LUXO, LA BARRA - PDE, UY',
    backgroundImage: '/PopUp_Chris_Banner.jpg',
    colors: {
      primary: '#4A5FE8', // Blue from image
      secondary: '#8B5FE8', // Purple from image
      accent: '#E8944A', // Orange from image
    },
  },
};

export const getPopupConfig = (popupId: number): PopupConfig | null => {
  return POPUP_CONFIGS[popupId] || null;
};

export const ACTIVE_POPUP_ID = 1; // Chris Stussy popup
