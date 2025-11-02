// server/server.js
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Load service account from JSON file
const serviceAccount = require("./serviceAccountKey.json"); // ← FIXED

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ---------- MIDDLEWARE: Verify Firebase ID Token ----------
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ---------- CREATE Review ----------
app.post("/api/reviews", verifyToken, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  const review = {
    movieId,
    rating,
    comment,
    userId: req.user.uid,
    userEmail: req.user.email,
    createdAt: new Date().toISOString(),
  };
  const docRef = await db.collection("reviews").add(review);
  res.json({ id: docRef.id, ...review });
});

// ---------- READ All Reviews (for Profile) ----------
app.get("/api/reviews", async (req, res) => {
  const snapshot = await db.collection("reviews").get();
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(reviews);
});

// ---------- READ Reviews by Movie ----------
app.get("/api/reviews/movie/:movieId", async (req, res) => {
  const snapshot = await db
    .collection("reviews")
    .where("movieId", "==", req.params.movieId)
    .get();
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(reviews);
});

// ---------- UPDATE Review ----------
app.put("/api/reviews/:id", verifyToken, async (req, res) => {
  const reviewRef = db.collection("reviews").doc(req.params.id);
  const reviewSnap = await reviewRef.get();
  if (!reviewSnap.exists || reviewSnap.data().userId !== req.user.uid) {
    return res.status(403).json({ error: "Not authorized" });
  }
  await reviewRef.update(req.body);
  res.json({ message: "Updated" });
});

// ---------- DELETE Review ----------
app.delete("/api/reviews/:id", verifyToken, async (req, res) => {
  const reviewRef = db.collection("reviews").doc(req.params.id);
  const reviewSnap = await reviewRef.get();
  if (!reviewSnap.exists || reviewSnap.data().userId !== req.user.uid) {
    return res.status(403).json({ error: "Not authorized" });
  }
  await reviewRef.delete();
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});