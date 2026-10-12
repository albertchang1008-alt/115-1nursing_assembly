// Firebase 專案設定（nursing-assembly）
// 這組設定本來就會公開在網頁上，安全性由 firestore.rules 把關，不用擔心外洩。
export const firebaseConfig = {
  apiKey: "AIzaSyAjgAPXij2Z5wSzIdoj9Ot23yIaGJuSHyk",
  authDomain: "nursing-assembly.firebaseapp.com",
  projectId: "nursing-assembly",
  storageBucket: "nursing-assembly.firebasestorage.app",
  messagingSenderId: "1079732933616",
  appId: "1:1079732933616:web:526e088b4e80b9cf8a0335",
};

// 回饋頁最後一定會出現的求助資訊，建議寫具體（地點、時間、可以找誰）
export const HELP_TEXT =
  "如果你最近在班上相處得不太開心，可以找導師或輔導室聊聊，我們都在。";
