import type { MouseEvent } from 'react';

/**
 * Centralised Atelier Configuration & Funnel Links
 * Controls WhatsApp direct messaging intents, Instagram deep linking,
 * and concierge specification handoffs.
 */

export const INSERT_PHONE = '447721391972';
export const ATELIER_PHONE = INSERT_PHONE;
export const ATELIER_INSTAGRAM_HANDLE = 'Brindleydiamonds';
export const ATELIER_INSTAGRAM_DM_WEB = 'https://ig.me/m/Brindleydiamonds';
export const ATELIER_INSTAGRAM_APP = 'instagram://user?username=Brindleydiamonds';

/**
 * 1. Hero CTA WhatsApp pre-filled intent
 */
export const getHeroWhatsAppUrl = (phone = ATELIER_PHONE): string => {
  return `https://wa.me/${phone}?text=Hi%20Brindley%20Diamonds%2C%20I%20would%20like%20to%20enquire%20about%20a%20private%20bespoke%20commission.`;
};

/**
 * 2. Product Card CTA WhatsApp dynamic spec injection
 */
export const getProductWhatsAppUrl = (productName: string, phone = ATELIER_PHONE): string => {
  const cleanName = productName.trim();
  return `https://wa.me/${phone}?text=Hi%20Brindley%20Diamonds%2C%20I%20am%20viewing%20the%20${encodeURIComponent(cleanName)}%20and%20would%20like%20to%20see%20the%204K%20video%20and%20specifications.`;
};

/**
 * 3. Stone Allocation Selector WhatsApp dynamic handoff
 */
export const getAllocationWhatsAppUrl = (
  silhouette: string,
  setting: string,
  carat: string,
  phone = ATELIER_PHONE
): string => {
  return `https://wa.me/${phone}?text=Hi%20Brindley%20Diamonds%2C%20I%20have%20configured%20a%20specification%3A%20Silhouette%3A%20${encodeURIComponent(silhouette)}%2C%20Setting%3A%20${encodeURIComponent(setting)}%2C%20Tier%3A%20${encodeURIComponent(carat)}.%20Please%20share%20availability%20and%20stone%20videos.`;
};

/**
 * Instagram Deep-Link handler with web fallback
 */
export const openInstagramDM = (e?: MouseEvent): void => {
  if (e) {
    e.preventDefault();
  }
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    const start = Date.now();
    window.location.href = ATELIER_INSTAGRAM_APP;
    setTimeout(() => {
      // If still in the same view after short delay, fallback to web
      if (Date.now() - start < 2200) {
        window.location.href = ATELIER_INSTAGRAM_DM_WEB;
      }
    }, 800);
  } else {
    window.open(ATELIER_INSTAGRAM_DM_WEB, '_blank', 'noopener,noreferrer');
  }
};
