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

app.use(
  cors({
    origin: "http://localhost:3000", // 클라이언트 도메인
    methods: ["GET", "POST", "DELETE"],
  })
);
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
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS user_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      value INTEGER NOT NULL CHECK (value IN (0, 1)), -- 1: 좋아요, 0: 안 좋아요
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, post_id), -- 한 사용자가 하나의 게시글에 대해 한 번만 행동 가능
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(post_id) REFERENCES posts(id)
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

    const query =
      "INSERT INTO posts (user_id, title, content, image_url) VALUES (?, ?, ?, ?)";
    db.run(query, [decoded.id, title, content, imageUrl], function (err) {
      if (err) {
        console.error("데이터베이스 오류:", err.message);
        return res
          .status(500)
          .json({ message: "게시글 작성에 실패했습니다.", error: err.message });
      }
      res
        .status(201)
        .json({ message: "게시글 작성 성공!", postId: this.lastID });
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
  const query =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  db.run(query, [username, hashedPassword, email], function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "회원가입 실패", error: err.message });
    }
    res.status(201).json({ message: "회원가입 성공!", userId: this.lastID });
  });
});

// **로그인**
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "아이디와 비밀번호를 입력해주세요." });
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
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "로그인 성공!", token });
  });
});
//검색 기능
app.get("/posts/search", (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: "검색어가 없습니다." });
  }

  const searchQuery = `%${query}%`;
  const sql = `
	  SELECT posts.id, posts.title, posts.likes, users.username
	  FROM posts
	  JOIN users ON posts.user_id = users.id
	  WHERE posts.title LIKE ? OR posts.content LIKE ?
	  ORDER BY posts.created_at DESC
	`;
  db.all(sql, [searchQuery, searchQuery], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "게시글 검색 실패", error: err.message });
    }
    res.json(rows);
  });
});

app.get("/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1; // 현재 페이지 번호 (기본값 1)
  const limit = parseInt(req.query.limit) || 5; // 페이지당 데이터 수 (기본값 5)
  const offset = (page - 1) * limit; // SQL OFFSET 계산

  const query = `
	  SELECT posts.id, posts.title, posts.likes, users.username
	  FROM posts
	  JOIN users ON posts.user_id = users.id
	  ORDER BY posts.created_at DESC
	  LIMIT ? OFFSET ?
	`;

  db.all(query, [limit, offset], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "게시글을 가져오는 데 실패했습니다.",
        error: err.message,
      });
    }

    // 전체 게시글 수 가져오기 (페이지네이션 정보를 제공하기 위해)
    const countQuery = `SELECT COUNT(*) as total FROM posts`;
    db.get(countQuery, (err, countRow) => {
      if (err) {
        return res.status(500).json({
          message: "게시글 수를 가져오는 데 실패했습니다.",
          error: err.message,
        });
      }
      res.json({
        posts: rows,
        total: countRow.total, // 전체 게시글 수
        page, // 현재 페이지 번호
        limit, // 한 페이지에 표시되는 데이터 수
      });
    });
  });
});

app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  let isAuthor = false; // 작성자 여부를 기본값으로 설정
  let userId = null; // 기본 사용자 ID는 null

  // 로그인된 사용자가 있을 경우, 사용자 정보를 가져옴
  console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      userId = decoded.id;
      isAuthor = true; // 토큰이 유효하면 작성자 여부를 true로 설정
    } catch (error) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  }

  // 게시글 정보 조회
  const query = `
      SELECT 
          p.id, p.title, p.content, p.image_url, p.created_at, p.likes, p.user_id
      FROM posts p
      WHERE p.id = ?
  `;

  db.get(query, [postId], (err, post) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "데이터베이스 오류", error: err.message });
    }
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 여부를 추가하여 응답
    console.log(`post :${post.user_id}`);
    console.log(`userId : ${userId}`);
    if (userId && post.user_id === userId) {
      post.isAuthor = true; // 로그인한 사용자라면 작성자 여부 추가
    } else {
      post.isAuthor = false; // 작성자가 아니라면 false
    }

    res.status(200).json(post);
  });
});

//좋아요
app.post("/posts/:id/like", (req, res) => {
  const postId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    // 현재 상태 확인
    const checkQuery =
      "SELECT value FROM user_likes WHERE user_id = ? AND post_id = ?";
    db.get(checkQuery, [userId, postId], (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "데이터베이스 오류", error: err.message });
      }

      if (row) {
        // 이미 좋아요를 눌렀으면 좋아요 취소
        const deleteQuery =
          "DELETE FROM user_likes WHERE user_id = ? AND post_id = ?";
        db.run(deleteQuery, [userId, postId], (err) => {
          if (err) {
            return res.status(500).json({
              message: "좋아요 취소 실패",
              error: err.message,
            });
          }

          // 게시글 좋아요 카운트 감소
          const decrementQuery =
            "UPDATE posts SET likes = likes - 1 WHERE id = ?";
          db.run(decrementQuery, [postId], (err) => {
            if (err) {
              return res.status(500).json({
                message: "좋아요 카운트 업데이트 실패",
                error: err.message,
              });
            }
            res.status(200).json({ message: 0 });
          });
        });
        return;
      }

      // 처음 좋아요를 누르는 경우
      const insertQuery =
        "INSERT INTO user_likes (user_id, post_id, value) VALUES (?, ?, 1)";
      db.run(insertQuery, [userId, postId], function (err) {
        if (err) {
          return res
            .status(500)
            .json({ message: "좋아요 등록 실패", error: err.message });
        }

        // 게시글 좋아요 카운트 증가
        const incrementQuery =
          "UPDATE posts SET likes = likes + 1 WHERE id = ?";
        db.run(incrementQuery, [postId], (err) => {
          if (err) {
            return res.status(500).json({
              message: "좋아요 카운트 업데이트 실패",
              error: err.message,
            });
          }
          res.status(200).json({ message: 1 });
        });
      });
    });
  } catch (error) {
    res.status(401).json({ message: "좋아요를 누르려면 로그인해야 합니다." });
  }
});

//좋아요 체크
app.get("/posts/:id/like-status", (req, res) => {
  const postId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1];

  let likeStatus = 0; // 기본적으로 좋아요 상태는 0

  // 로그인된 사용자가 있을 경우, 사용자 정보 가져옴
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;

      const checkQuery =
        "SELECT value FROM user_likes WHERE user_id = ? AND post_id = ?";
      db.get(checkQuery, [userId, postId], (err, row) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "데이터베이스 오류", error: err.message });
        }

        likeStatus = row ? row.value : 0; // 좋아요 상태 가져오기, 없으면 0
        res.status(200).json({ likeStatus });
      });
    } catch (error) {
      return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  } else {
    // 비로그인 사용자일 경우, 기본적으로 좋아요 상태는 0으로 처리
    res.status(200).json({ likeStatus });
  }
});
//글 삭제
app.delete("/posts/:id", (req, res) => {
  const postId = req.params.id; // 삭제할 게시글 ID
  const token = req.headers.authorization?.split(" ")[1]; // 사용자 인증 토큰

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id; // 토큰에서 사용자 ID 추출

    // 게시글 작성자 확인
    const authorCheckQuery = "SELECT user_id FROM posts WHERE id = ?";
    db.get(authorCheckQuery, [postId], (err, post) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "데이터베이스 오류", error: err.message });
      }
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }
      if (post.user_id !== userId) {
        return res
          .status(403)
          .json({ message: "작성자만 게시글을 삭제할 수 있습니다." });
      }

      // 게시글 삭제
      const deletePostQuery = "DELETE FROM posts WHERE id = ?";
      db.run(deletePostQuery, [postId], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "게시글 삭제 실패", error: err.message });
        }

        // 게시글과 연관된 데이터 삭제 (예: 좋아요 정보)
        const deleteLikesQuery = "DELETE FROM user_likes WHERE post_id = ?";
        db.run(deleteLikesQuery, [postId], (err) => {
          if (err) {
            return res.status(500).json({
              message: "관련 데이터 삭제 실패",
              error: err.message,
            });
          }

          res.status(200).json({ message: "게시글 삭제 성공" });
        });
      });
    });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
});

// 로그인 상태 확인 API
app.get("/check-login", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Authorization 헤더에서 토큰 추출

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // 토큰을 검증하여 유효한지 확인
    res.status(200).json({ message: "로그인된 상태입니다.", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
});

// 글 수정 API (PATCH)
app.patch("/posts/:id", upload.single("image"), (req, res) => {
  const postId = req.params.id; // 수정할 게시글 ID
  const token = req.headers.authorization?.split(" ")[1]; // 사용자 인증 토큰

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id; // 토큰에서 사용자 ID 추출

    const { title, content } = req.body;

    // 입력값이 비어있으면 오류 처리
    console.log(`${title} ${content}`);
    if (!title && !content) {
      return res.status(400).json({
        message: "수정할 제목 또는 내용을 입력해주세요.",
      });
    }

    // 게시글 작성자 확인
    const authorCheckQuery = "SELECT user_id FROM posts WHERE id = ?";
    db.get(authorCheckQuery, [postId], (err, post) => {
      if (err) {
        return res.status(500).json({
          message: "데이터베이스 오류",
          error: err.message,
        });
      }
      if (!post) {
        return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }
      if (post.user_id !== userId) {
        return res
          .status(403)
          .json({ message: "작성자만 게시글을 수정할 수 있습니다." });
      }

      // 업데이트 쿼리 생성 (동적으로 수정)
      const updates = [];
      const values = [];
      if (title) {
        updates.push("title = ?");
        values.push(title);
      }
      if (content) {
        updates.push("content = ?");
        values.push(content);
      }
      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`; // 이미지 경로 생성
        updates.push("image_url = ?");
        values.push(imageUrl);
      }
      values.push(postId); // WHERE 조건에 사용할 postId 추가

      const updateQuery = `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`;

      db.run(updateQuery, values, (err) => {
        if (err) {
          return res.status(500).json({
            message: "게시글 수정에 실패했습니다.",
            error: err.message,
          });
        }

        res.status(200).json({ message: "게시글이 수정되었습니다." });
      });
    });
  } catch (error) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
