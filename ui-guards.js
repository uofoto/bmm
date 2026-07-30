// ui-guards.js — küçük güvenlik yamaları: eksik DOM elemanlarına erişimden doğan runtime hatalarını azaltmak
// Bu dosya, ui.js içinde doğrudan getElementById(...).addEventListener(...) çağrılarının null üzerinde
// çalışması durumunda oluşabilecek hataları tamamen ortadan kaldıramaz (o hatalar ui.js yüklenirken atılmış olabilir),
// fakat eksik/şartlı elementler bulunduğunda gerekli event listener'ları güvenli şekilde yeniden kurar ve
// bazı global fonksiyonlar için güvenli fallback'ler sağlar.

(function () {
  'use strict';

  const idsToBoundClick = [
    'mosqueInfoModal',
    'mosqueInfoEditModal',
    'mosqueEditModal',
    'deletedMosquesModal',
    'termsModal',
    'lightboxModal'
  ];

  function safeAddModalClick(id, handler) {
    try {
      const el = document.getElementById(id);
      if (!el) return;
      // Avoid double-binding
      if (el._uiGuardsBound) return;
      el.addEventListener('click', handler);
      el._uiGuardsBound = true;
    } catch (e) {
      // sessizce yok say
      console.warn('ui-guards: safeAddModalClick failed for', id, e && e.message);
    }
  }

  function bindDefaults() {
    // Eğer ui.js içinde bu listener'lar eklenmemişse buradan güvenli şekilde ekleyelim
    safeAddModalClick('mosqueInfoModal', function (e) { if (e.target === this && typeof window.closeMosqueInfoModal === 'function') window.closeMosqueInfoModal(); });
    safeAddModalClick('mosqueInfoEditModal', function (e) { if (e.target === this && typeof window.closeMosqueInfoEditModal === 'function') window.closeMosqueInfoEditModal(); });
    safeAddModalClick('mosqueEditModal', function (e) { if (e.target === this && typeof window.closeMosqueEditModal === 'function') window.closeMosqueEditModal(); });
    safeAddModalClick('deletedMosquesModal', function (e) { if (e.target === this && typeof window.closeDeletedMosquesModal === 'function') window.closeDeletedMosquesModal(); });
    safeAddModalClick('termsModal', function (e) { if (e.target === this && typeof window.closeTermsModal === 'function') window.closeTermsModal(); });
    safeAddModalClick('lightboxModal', function (e) { if (e.target === this && typeof window.closeLightbox === 'function') window.closeLightbox(); });
  }

  // Bazı global fonksiyonların undefined olması durumunda uygulamanın çökmesini engellemek
  // için hafif fallback'ler tanımlayalım. Gerçek fonksiyonlar ui.js tarafından yüklendiğinde
  // bunlar üzerine yazılır.
  if (typeof window.closeMosqueInfoModal !== 'function') window.closeMosqueInfoModal = function () {};
  if (typeof window.closeMosqueInfoEditModal !== 'function') window.closeMosqueInfoEditModal = function () {};
  if (typeof window.closeMosqueEditModal !== 'function') window.closeMosqueEditModal = function () {};
  if (typeof window.closeDeletedMosquesModal !== 'function') window.closeDeletedMosquesModal = function () {};
  if (typeof window.closeTermsModal !== 'function') window.closeTermsModal = function () {};
  if (typeof window.closeLightbox !== 'function') window.closeLightbox = function () {};

  document.addEventListener('DOMContentLoaded', bindDefaults);
  // Eğer DOM zaten yüklüyse hemen bağla
  if (document.readyState === 'interactive' || document.readyState === 'complete') bindDefaults();
})();
