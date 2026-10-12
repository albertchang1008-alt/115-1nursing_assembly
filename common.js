// 三個頁面共用：Firebase 初始化、題目內容、回饋文字
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, HELP_TEXT } from "./firebase-config.js";

export { HELP_TEXT };
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 本機測試用：網址加上 ?emu 會連到 Firebase 模擬器，正式使用不會觸發
export const USE_EMULATOR = new URLSearchParams(location.search).has("emu");
if (USE_EMULATOR) {
  connectFirestoreEmulator(db, location.hostname, 8080);
  connectAuthEmulator(auth, `http://${location.hostname}:9099`, { disableWarnings: true });
}

export const SHARDS = 10; // 參與人數計數器分片數（要和 firestore.rules 的 [0-9] 一致）

// ===== 題目與回饋（要改字，改這裡就好）=====
export const Q = {
  a1: {
    title: "上次跑班或選修課，離開教室前你做到了哪些？",
    hint: "可複選",
    options: [
      { v: "seat", t: "🪑 桌椅排回原位", short: "把桌椅排回原位" },
      { v: "trash", t: "🥤 自己的垃圾和飲料杯帶走", short: "把垃圾和飲料杯帶走" },
    ],
    none: "這次沒特別注意到",
  },
  a2: {
    title: "如果你回到自己教室，發現桌椅亂了、抽屜裡有別人的垃圾，你會有多在意？",
    min: "不太在意",
    max: "非常在意",
  },
  b1: {
    title: "同學技術考失誤、心情低落時，你比較常怎麼做？",
    options: [
      { v: 1, t: "主動關心，或約對方一起練習", fb: "你做的事，就是未來臨床上好同事的樣子。" },
      { v: 2, t: "想關心，但不知道怎麼開口", fb: "不用說什麼大道理，一句「要不要一起再練一次？」就夠了。" },
      { v: 3, t: "通常不會特別反應", fb: "每個人都有自己的壓力。下次不妨給對方一個點頭或一句「辛苦了」，對方會記得。" },
      { v: 4, t: "會和朋友聊起這件事", fb: "想想如果失誤的是自己，會希望大家怎麼談論這件事？" },
    ],
  },
  b2: {
    title: "班上群組出現拿某位同學開玩笑的訊息時，你比較常怎麼做？",
    options: [
      { v: 1, t: "不跟著回應，私下關心當事人", fb: "謝謝你，這種不張揚的善意最有力量。" },
      { v: 2, t: "看看就好，不參與", fb: "不跟著起鬨已經是一種表態。如果願意，私訊對方一句「還好嗎？」會讓他知道自己不是一個人。" },
      { v: 3, t: "想做點什麼，但怕自己被針對", fb: "這個擔心很正常。不必公開出頭，轉移話題或私下關心，都是安全又有效的做法。" },
      { v: 4, t: "會跟著回應或按表情", fb: "一個表情符號，對當事人來說可能是很多人在笑他。下次可以試試先不回應。" },
    ],
  },
  c1: {
    title: "這週我願意試試看的一件小事",
    options: [
      { v: "look", t: "離開教室前回頭看一眼座位" },
      { v: "nofollow", t: "群組裡不跟風" },
      { v: "talk", t: "主動跟一位比較少互動的同學說說話" },
      { v: "none", t: "先不選" },
    ],
  },
  c2: {
    title: "你覺得能讓班上相處更舒服的一個小做法是？",
    hint: "選填，最多 100 字。會後由老師整理公布，不會顯示任何身分資訊。請不要寫出同學的名字。",
    max: 100,
  },
};

// 依作答內容產生個人回饋
export function feedbackFor(ans) {
  const out = [];
  const done = ans.a1 || [];
  if (done.length === 2) {
    out.push({ tag: "共用的空間", text: "謝謝你！原班同學回到教室，看到的是整齊的座位。" });
  } else if (done.length === 1) {
    const missing = Q.a1.options.find((o) => !done.includes(o.v));
    out.push({ tag: "共用的空間", text: `已經做到一半了，下次離開前再多做「${missing.short}」就完整了。` });
  } else {
    out.push({ tag: "共用的空間", text: "很多人一開始也沒留意。下次離開前，花 10 秒回頭看一眼座位就好。" });
  }
  out.push({
    tag: "將心比心",
    text: "你在意的事，別班同學也一樣在意。「你怎麼對待別人的教室，別人就怎麼對待我們的教室。」",
  });
  const b1 = Q.b1.options.find((o) => o.v === ans.b1);
  if (b1) out.push({ tag: "同學失誤時", text: b1.fb });
  const b2 = Q.b2.options.find((o) => o.v === ans.b2);
  if (b2) out.push({ tag: "群組裡", text: b2.fb });
  const c1 = Q.c1.options.find((o) => o.v === ans.c1);
  if (c1 && c1.v !== "none") {
    out.push({ tag: "我的一小步", text: `你選了：「${c1.t}」。一週後回頭看看，你做到了嗎？` });
  } else {
    out.push({ tag: "我的一小步", text: "沒關係，哪天想到了再開始就好。" });
  }
  return out;
}
