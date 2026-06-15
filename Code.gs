/**
 * ZALLY GOLF CLUB – PROMPT MASTER
 * Google Apps Script back-end.
 *
 * Two-file project:
 *   - Code.gs   (this file)  -> server logic + image links + completion email
 *   - Index.html             -> the game (image sources injected via <?= ?>)
 *
 * IMAGE HANDLING (Google Drive, high performance):
 *   The three Zally sprites are NOT loaded with DriveApp or any API call.
 *   They are plain text links. Paste the Drive FILE ID of each picture in
 *   place of FILE_ID (no square brackets), and share each image as
 *   "Anyone with the link" so the game can read it.
 *
 *   ⚠️ occhio a Zally kart: the kart link below feeds TWO spots in Index.html
 *      (the <img id="kartImg"> tag AND SPR_KART.src), so one ID covers both.
 */

// ── DRIVE IMAGE LINKS ─────────────────────────────────────────────────────
// Replace FILE_ID with the Drive file ID of each image (no brackets).
var IDLE_IMG  = 'https://lh3.googleusercontent.com/d/FILE_ID'; // Zally idle sprite
var SWING_IMG = 'https://lh3.googleusercontent.com/d/FILE_ID'; // Zally swing sprite
var KART_IMG  = 'https://lh3.googleusercontent.com/d/FILE_ID'; // Zally kart  (used twice)

/**
 * Web app entry point. Injects the image links into the HTML template.
 */
function doGet() {
  var t = HtmlService.createTemplateFromFile('Index');
  t.idleImg  = IDLE_IMG;
  t.swingImg = SWING_IMG;
  t.kartImg  = KART_IMG;
  return t.evaluate()
          .setTitle('Zally Golf Club - Prompt Master')
          .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fired silently from Index.html the moment the player sinks the final putt.
 * Sends the active player a golf-themed "cheat sheet" of the four techniques.
 */
function sendCompletionEmail() {
  var email = Session.getActiveUser().getEmail();
  if (!email) return; // no recipient (e.g. anonymous access) -> stay silent

  MailApp.sendEmail({
    to: email,
    subject: '🏆 HOLE 18 CLEARED — You just went UNDER PAR as a Prompt Master!',
    htmlBody: buildCheatSheetEmail()
  });
}

/**
 * Builds the HTML body of the completion email.
 * The takeaways below were written by analysing the four challenges in the
 * game (Role-Playing, Negative Prompting, Self-Correction, Meta-Prompting).
 */
function buildCheatSheetEmail() {
  var takeaway = function (emoji, color, title, line) {
    return '' +
      '<div style="border-left:6px solid ' + color + ';background:' + color + '14;' +
      'border-radius:8px;padding:14px 18px;margin:14px 0;">' +
        '<div style="font-size:16px;font-weight:800;color:' + color + ';margin-bottom:6px;">' +
          emoji + '&nbsp;' + title +
        '</div>' +
        '<div style="font-size:14px;line-height:1.6;color:#2b2b2b;">' + line + '</div>' +
      '</div>';
  };

  return '' +
  '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;' +
  'background:#ffffff;border:1px solid #e6e6e6;border-radius:14px;overflow:hidden;">' +

    // ── Header (the trophy hero) ──
    '<div style="background:linear-gradient(135deg,#0b6e3b 0%,#0e8a4a 60%,#13a85a 100%);' +
    'padding:32px 24px;text-align:center;color:#fff;">' +
      '<div style="font-size:46px;line-height:1;">🏌️‍♂️🏆⛳</div>' +
      '<h1 style="margin:14px 0 4px;font-size:24px;letter-spacing:1px;">HOLE-IN-ONE!</h1>' +
      '<p style="margin:0;font-size:14px;opacity:.92;">You aced all 4 shots at the ' +
      '<b>Zally Golf Club — Prompt Master</b></p>' +
    '</div>' +

    // ── Intro ──
    '<div style="padding:24px 24px 6px;">' +
      '<p style="font-size:15px;line-height:1.6;color:#2b2b2b;margin:0 0 10px;">' +
        'Fore! 📣 You teed off on Hole 18 and sank every putt without a single ' +
        '<i>mulligan</i>. Par was 4, and you just drove your prompting skills ' +
        '<b>straight onto the green</b>. Keep this scorecard in your golf bag — ' +
        'four clubs that work on <b>any</b> course you play.' +
      '</p>' +
      '<div style="font-size:13px;font-weight:700;color:#0e8a4a;text-transform:uppercase;' +
      'letter-spacing:1px;margin:18px 0 2px;">⛳ Your Prompt Master Cheat Sheet</div>' +
    '</div>' +

    // ── The four takeaways (written from the in-game challenges) ──
    '<div style="padding:0 24px 6px;">' +
      takeaway('🎭', '#e74c3c', 'SHOT 1 — Advanced Role-Playing',
        'Hand the AI a <b>club, not a wish</b>: give it a precise persona, a tone of ' +
        'voice and clear constraints (length, budget, format). Role + style + ' +
        'constraints turns a generic reply into one tailored to <b>your</b> situation.') +

      takeaway('🚫', '#e67e22', 'SHOT 2 — Negative Prompting',
        'Play the bunkers <b>before</b> you swing. Spell out what you ' +
        '<b>DO NOT</b> want and add a number — "no horror, nothing over 2 hours, ' +
        'no spoilers". Explicit bans switch off the AI\'s default habits and keep ' +
        'the output exactly in bounds.') +

      takeaway('🔄', '#3498db', 'SHOT 3 — Self-Correction',
        'Never settle for your first drive. Ask the AI to <b>re-read and grade its ' +
        'own draft</b>, spot the weak spots, and rewrite them with specific fixes. ' +
        'It becomes its own caddie — and the second shot lands far closer to the pin.') +

      takeaway('🧠', '#9b59b6', 'SHOT 4 — Meta-Prompting',
        'When you don\'t even know which club to pick, let the AI <b>build the prompt ' +
        'for you</b>. Tell it to interview you first — "ask me 4 questions, then craft ' +
        'the perfect request" — and the final answer is teed up around your real needs.') +
    '</div>' +

    // ── Closing CTA ──
    '<div style="margin:8px 24px 24px;background:#0b6e3b0d;border-radius:10px;' +
    'padding:16px 18px;">' +
      '<p style="font-size:14px;line-height:1.6;color:#2b2b2b;margin:0;">' +
        '🎯 <b>Next round:</b> pick one technique today and swing it at a real task. ' +
        'Mix all four and you\'re no longer just on the fairway — you\'re ' +
        '<b>under par</b> for life. Now go be the Prompt Master you were teed up to be! 💪' +
      '</p>' +
    '</div>' +

    // ── Footer ──
    '<div style="background:#0b3a22;color:#bfe8cf;text-align:center;padding:14px;' +
    'font-size:11px;letter-spacing:.5px;">' +
      'ZALLY GOLF CLUB · PROMPT MASTER EDITION · ARCADE DIVISION 198X' +
    '</div>' +

  '</div>';
}
