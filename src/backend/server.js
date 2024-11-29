const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const PORT = 4000;
const SECRET_KEY = "your_secret_key"; // JWT 토큰 서명 키
const multer = require("multer"); // 파일 업로드를 위한 라이브러리
const path = require("path");

app.use(cors()); // 모든 도메인 허용

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// SQLite 데이터베이스 연결
const db = new sqlite3.Database("database.db");

// 테이블 생성
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT UNIQUE
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 

      
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 'uploads' 폴더에 저장
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 파일 이름 중복 방지
  },
});
const upload = multer({ storage });


//게시글 작성
app.post("/posts", upload.single("image"), (req, res) => {
  console.log("POST /posts 요청 도달");
  console.log("req.file:", req.file); // 파일 정보
  console.log("req.body:", req.body); // 본문 데이터

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded 토큰:", decoded);

    const { title, content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
    }

    const query = "INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)";
    db.run(query, [decoded.id, title, content, imageUrl], function (err) {
      if (err) {
        console.error("데이터베이스 오류:", err.message);
        return res.status(500).json({ message: "게시글 작성에 실패했습니다.", error: err.message });
      }
      res.status(201).json({ message: "게시글 작성 성공!", postId: this.lastID });
    });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
});


// **회원가입**
app.post("/register", async (req, res) => {
  console.log(req.body); // 요청 데이터 확인
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "모든 필드를 입력해주세요." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  db.run(query, [username, hashedPassword, email], function (err) {
    if (err) {
      return res.status(500).json({ message: "회원가입 실패", error: err.message });
    }
    res.status(201).json({ message: "회원가입 성공!", userId: this.lastID });
  });
});


// **로그인**
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.get(query, [username], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "아이디가 존재하지 않습니다." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password); // 비밀번호 비교
    if (!isValidPassword) {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    // 로그인 성공 -> JWT 발급
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ message: "로그인 성공!", token });
  });
});


app.get("/posts", (req, res) => {
  console.log("2");
  const query = `
    SELECT posts.id, posts.title, posts.likes, posts.dislikes, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "게시글을 가져오는 데 실패했습니다.", error: err.message });
    }
    res.json(rows);
  });
});

//게시글 상세 보기
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;

  const query = `
  SELECT posts.id, posts.title, posts.content, posts.image_url, posts.likes, posts.dislikes, users.username, posts.created_at
  FROM posts
  JOIN users ON posts.user_id = users.id
  WHERE posts.id = ?
`;
  db.get(query, [postId], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "게시글을 가져오는 데 실패했습니다.", error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }
    res.json(row);
  });
});
app.post("/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE posts SET likes = likes + 1 WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: "좋아요 처리 실패", error: err.message });
    }
    res.status(200).json({ message: "좋아요 성공" });
  });
});
app.post("/posts/:id/dislike", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: "싫어요 처리 실패", error: err.message });
    }
    res.status(200).json({ message: "싫어요 성공" });
  });
});
// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
