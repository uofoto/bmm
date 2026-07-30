// map-guards.js — Harita ile ilgili modal/event güvenlik bağlayıcıları ve hafif fallback'ler
// Amaç: map.js içindeki doğrudan DOM erişimleri veya global fonksiyon kullanımları
// nedeniyle oluşabilecek runtime hatalarını azaltmak. Orijinal fonksiyonlar yüklendiğinde
// bunlar üzerine yazılacaktır.

(function () {
  'use strict';

  function safeAddClickOnce(id, handler) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      if (el._mapGuardsBound) return;
      el.addEventListener('click', handler);
      el._mapGuardsBound = true;
    } catch (e) {
      console.warn('map-guards: safeAddClickOnce failed for', id, e && e.message);
    }
  }

  function bindModalBackdrops() {
    safeAddClickOnce('mapModal', function (e) { if (e.target === this && typeof window.closeMapModal === 'function') window.closeMapModal(); });
    safeAddClickOnce('routeModal', function (e) { if (e.target === this && typeof window.closeRouteModal === 'function') window.closeRouteModal(); });
    safeAddClickOnce('nearbyModal', function (e) { if (e.target === this && typeof window.closeNearbyModal === 'function') window.closeNearbyModal(); });
    safeAddClickOnce('journeyModal', function (e) { if (e.target === this && typeof window.closeJourneyModal === 'function') window.closeJourneyModal(); });
  }

  // Hafif fallback fonksiyonları — orijinal map.js yüklendiğinde bunlar üzerine yazılır
  if (typeof window.openMapModal !== 'function') window.openMapModal = function () { const el = document.getElementById('mapModal'); if (el) el.classList.remove('hidden'); };
  if (typeof window.closeMapModal !== 'function') window.closeMapModal = function () { const el = document.getElementById('mapModal'); if (el) el.classList.add('hidden'); };
  if (typeof window.openRouteModal !== 'function') window.openRouteModal = function () { const el = document.getElementById('routeModal'); if (el) el.classList.remove('hidden'); };
  if (typeof window.closeRouteModal !== 'function') window.closeRouteModal = function () { const el = document.getElementById('routeModal'); if (el) el.classList.add('hidden'); };
  if (typeof window.openNearbyModal !== 'function') window.openNearbyModal = function () { const el = document.getElementById('nearbyModal'); if (el) el.classList.remove('hidden'); };
  if (typeof window.closeNearbyModal !== 'function') window.closeNearbyModal = function () { const el = document.getElementById('nearbyModal'); if (el) el.classList.add('hidden'); };
  if (typeof window.openJourneyModal !== 'function') window.openJourneyModal = function () { const el = document.getElementById('journeyModal'); if (el) el.classList.remove('hidden'); };
  if (typeof window.closeJourneyModal !== 'function') window.closeJourneyModal = function () { const el = document.getElementById('journeyModal'); if (el) el.classList.add('hidden'); };

  // Swipe container ve map container gibi elemanlar için güvenli event binding'leri
  function bindOptionalListeners() {
    try {
      const swipe = document.getElementById('swipeContainer');
      if (swipe && !swipe._mapGuardsTouchBound) {
        // Eğer map.js zaten touch listener eklediyse (aynı olay iki kere eklenmesin)
        swipe._mapGuardsTouchBound = true;
        // Kötü amaçlı çift-ekleme riskini azaltmak için burada yalnızca pasif placeholder eklemiyoruz;
        // eğer mevcutsa gerçek listener'lar map.js tarafında zaten kurulmuş olacaktır.
      }
    } catch (e) {
      console.warn('map-guards: bindOptionalListeners failed', e && e.message);
    }
  }

  document.addEventListener('DOMContentLoaded', function () { bindModalBackdrops(); bindOptionalListeners(); });
  if (document.readyState === 'interactive' || document.readyState === 'complete') { bindModalBackdrops(); bindOptionalListeners(); }
})();
