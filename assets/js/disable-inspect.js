/*==================================================================
  DISABLE RIGHT CLICK & INSPECT ELEMENT PROTECTION
==================================================================*/

(function () {
  'use strict';

  // 1. Disable Context Menu (Right Click)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, true);

  // 2. Disable Key Shortcuts for Developer Tools and Source Viewing
  document.addEventListener('keydown', function (e) {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const key = e.key ? e.key.toLowerCase() : '';
    const keyCode = e.keyCode || e.which;

    // F12 key
    if (keyCode === 123 || key === 'f12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    // Ctrl+Shift+J / Cmd+Option+J (Developer Console)
    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element selector)
    // Ctrl+Shift+K (Firefox Console)
    // Ctrl+Shift+E (Firefox Network)
    // Ctrl+Shift+M (Responsive Design Mode)
    if (isCtrlOrCmd && isShift && (key === 'i' || key === 'j' || key === 'c' || key === 'k' || key === 'e' || key === 'm')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Page Source)
    if (isCtrlOrCmd && (key === 'u' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (isCtrlOrCmd && (key === 's' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P / Cmd+P (Print Page)
    if (isCtrlOrCmd && (key === 'p' || keyCode === 80)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // 3. Disable Dragging of Images / Elements
  document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
  }, true);

  // 4. Anti-Debugging Protection (Debugger Pause Loop when DevTools is opened)
  const antiDebug = function () {
    function debuggerTrap(i) {
      if (('' + i / i).length !== 1 || i === 0) {
        (function () {}.constructor('debugger')());
      } else {
        (function () {}.constructor('debugger')());
      }
      debuggerTrap(++i);
    }
    try {
      debuggerTrap(0);
    } catch (e) {}
  };

  setInterval(antiDebug, 100);

})();
