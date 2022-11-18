// import
require("dotenv").config();
const express = require("express");
const app = express();

const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// db
const db = mysql.createConnection({
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dateStrings: "date",
});

// db.connect
db.connect((err) => {
  if (!err) {
    console.log("Mysql DB Success");
  } else {
    console.log(err);
  }
});

// multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage,
});

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

// url

// 회원가입
app.post("/regist", upload.single("profileimage"), (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const sellername = req.body.sellername;
  const email = req.body.email;
  const channelname = req.body.channelname;
  const channelplatform = req.body.channelplatform;
  const channelgenre = req.body.channelgenre;
  const url = req.body.url;
  const filename = req.file.filename;
  const intro = req.body.intro;

  let sql =
    "INSERT INTO user VALUES(NULL,?,?,?,?,?,?,?,?,?,?,'일반 판매자',now());";
  bcrypt.hash(req.body.pw, saltRounds, (err, hash_pw) => {
    db.query(
      sql,
      [
        id,
        hash_pw,
        sellername,
        email,
        channelname,
        channelplatform,
        channelgenre,
        url,
        filename,
        intro,
      ],
      (err) => {
        if (err) {
          throw err;
        }

        res.send({
          id: id,
          pw: hash_pw,
          sellername: sellername,
          email: email,
          channelname: channelname,
          channelplatform: channelplatform,
          channelgenre: channelgenre,
          url: url,
          filename: filename,
          intro: intro,
          status: 201,
          message: "회원가입 완료!",
        });
      }
    );
  });
});

// 로그인
app.post("/login", (req, res) => {
  const { id } = req.body;
  const { pw } = req.body;

  let sql = "SELECT * FROM user WHERE id=?;";
  db.query(sql, [req.body.id], (err, user) => {
    if (user[0] === undefined) {
      res.send({
        status: 404,
        message: "아이디를 확인해주세요.",
      });
    } else {
      bcrypt.compare(req.body.pw, user[0].pw, (err, result) => {
        if (result) {
          res.send({
            status: 201,
            message: user[0].id + "님 환영합니다",
            token: user[0].pw,
            id: user[0].id,
          });
        } else {
          res.send({
            status: 400,
            message: "비밀번호를 다시 확인해주세요.",
          });
        }
      });
    }
  });
});

// 마이페이지
app.get("/mypage", (req, res) => {
  let sql = "SELECT * FROM user WHERE id=?";
  db.query(sql, [userId], (err, response) => {
    if (err) {
      throw err;
    } else {
      res.send(response);
    }
  });
});

// 메인페이지
app.get("/main", (req, res) => {
  let sql = "SELECT * FROM item ORDER BY idx DESC;";
  db.query(sql, (err, response) => {
    if (err) {
      throw err;
    }
    res.send(response);
  });
});

// 관리자페이지에서 상품목록보이기
app.get("/goodsManager", (req, res) => {
  let sql = "SELECT * FROM item ORDER BY idx DESC LIMIT 0,10;";
  db.query(sql, (err, items) => {
    if (err) {
      throw err;
    }
    res.send(items);
  });
});

// 상품등록
app.post("/addItem", upload.single("attach"), (req, res) => {
  console.log(req.file);

  const { itemname } = req.body;
  const { category } = req.body;
  const { price } = req.body;
  const { stock } = req.body;
  const { filename } = req.file;
  const { contents } = req.body;
  const { madein } = req.body;

  let sql = "INSERT INTO item VALUES(NULL,?,?,?,?,?,?,?,now());";
  db.query(
    sql,
    [itemname, category, price, stock, filename, contents, madein],
    (err) => {
      if (err) {
        throw err;
      }
      res.send({ status: 201, message: "상품등록이 완료되었습니다!" });
    }
  );
});

// 상품삭제
app.delete("/delete/:idx", (req, res) => {
  let sql = "DELETE FROM item WHERE idx=?;";
  db.query(sql, [req.params.idx], (err) => {
    if (err) {
      throw err;
    }
    res.send({ status: 201, message: "상품이 삭제되었습니다." });
  });
});

// 상품 한개불러오기
app.get("/updateItem/:idx", (req, res) => {
  let sql = "SELECT * FROM item WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      throw err;
    }
    res.send(response);
  });
});

// 상품 수정
app.put("/updateItem/:idx", (req, res) => {
  const { itemname, category, price, stock, contents, madein } = req.body;
  const { filename } = req.file;

  let sql = "UPDATE item SET ";
  sql +=
    "itemname=?, category=?, price=?, stock=?, filename=?, content=?, madein=?, regdate=now() ";
  sql += "WHERE idx = ?;";
  db.query(
    sql,
    [
      itemname,
      category,
      price,
      stock,
      filename,
      contents,
      madein,
      req.query.idx,
    ],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("update complete");
        res.send({ status: 201, message: "상품 수정 완료" });
      }
    }
  );
});

//상품 상세보기
app.get("/detail/:idx", (req, res) => {
  let sql = "select * from item where idx =?;";
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      throw err;
    }
    res.send(response);
    // console.log(response);
  });
});

// 공지사항 작성
app.post("/writeNotice", (req, res) => {
  const noticeTitle = req.body.noticeTitle;
  const noticeWriter = req.body.noticeWriter;
  const noticeContent = req.body.noticeContent;

  let sql = "INSERT INTO notice VALUES(NULL,?,?,?,'1',now());";
  db.query(sql, [noticeTitle, noticeWriter, noticeContent], (err) => {
    if (err) {
      throw err;
    } else {
      res.send({ status: 201, message: "공지사항이 등록되었습니다!" });
    }
  });
});

// 문의하기
app.post("/ask", upload.single("askImage"), (req, res) => {
  const askCategory = req.body.askCategory;
  const askTitle = req.body.askTitle;
  const askWriter = req.body.askWriter;
  const filename = req.file.filename;
  const askContents = req.body.askContents;

  let sql = "INSERT INTO AskToAdmin VALUES(NULL,'미답변',?,?,?,?,?,now());";
  bcrypt.hash(req.body.pw, saltRounds, (err) => {
    db.query(
      sql,
      [askCategory, askTitle, askWriter, filename, askContents],
      (err) => {
        if (err) {
          throw err;
        }

        res.send({
          askCategory: askCategory,
          askTitle: askTitle,
          askWriter: askWriter,
          filename: filename,
          askContents: askContents,
          status: 201,
          message: "문의하기가 완료되었습니다.",
        });
      }
    );
  });
});

// 다중 게시판
app.get("/boardlist", (req, res) => {
  const page = Number.parseInt(req.query.page);
  const offset = Number.parseInt(req.query.offset);
  const startNum = page * offset;
  const select = req.query.select || "";
  const search = req.query.searchQuery || "";
  const codeSearch = "%" + search + "%";
  const nameSearch = "%" + search + "%";
  const categorySearch = "%" + search + "%";

  // db 1 : 전체 개시물 수
  // let sql = "SELECT COUNT(boardIdx) AS cnt FROM boardManager WHERE ? LIKE ?;";
  // db.query(sql, [select, search], (err, result) => {
  let sql =
    "SELECT COUNT(boardIdx) AS cnt FROM boardManager WHERE boardCode LIKE ? OR boardName LIKE ?  OR boardCategory LIKE ?;";
  db.query(sql, [codeSearch, nameSearch, categorySearch], (err, result) => {
    if (err) {
      throw err;
    } else {
      // db 2 : 페이징 처리를 위한 쿼리 AND 검색 쿼리
      let listSQL =
        "SELECT * FROM boardManager WHERE boardCode LIKE ? OR boardName LIKE ? OR boardCategory LIKE ? ORDER BY boardIdx DESC LIMIT ?, ?;";
      db.query(
        listSQL,
        [codeSearch, nameSearch, categorySearch, startNum, offset],
        (err, lists) => {
          if (err) {
            throw err;
          } else {
            res.send({
              lists,
              page, // 현재 페이지
              totalRows: result[0].cnt, // 전체 사용자 수
              totalPageNum: Math.ceil(result[0].cnt / offset), // 전체 페이지 수
            });
          }
        }
      );
    }
  });
});

app.post("/boardAdd", (req, res) => {
  const {
    boardCode,
    boardCategory,
    boardName,
    boardBuilder,
    boardReadAllow,
    boardWriteAllow,
    boardCommentAllow,
    boardModifyAllow,
  } = req.body;
  let sql =
    "INSERT INTO boardManager VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, now(), now());";
  db.query(
    sql,
    [
      boardCode,
      boardCategory,
      boardName,
      boardBuilder,
      boardReadAllow,
      boardWriteAllow,
      boardCommentAllow,
      boardModifyAllow,
    ],
    (err) => {
      if (err) {
        throw err;
      } else {
        res.send({ status: 201, message: "게시판 생성 완료" });
        let createSQL = "CREATE TABLE board" + boardName + "(";
        createSQL += "idx int auto_increment primary key,";
        createSQL += "title varchar(100),";
        createSQL += "writer varchar(50),";
        createSQL += "passwd varchar(255),";
        createSQL += "contents text,";
        createSQL += "image varchar(255),";
        createSQL += "view int default 0,";
        createSQL += "regdate date";
        createSQL += ");";
        db.query(createSQL, (err) => {
          if (err) {
            throw err;
          } else {
            console.log("board" + boardName + " Create Completed.");
          }
        });
      }
    }
  );
});

app.get("/boardUpdate", (req, res) => {
  console.log(req.query);
  let sql = "select * from boardManager where boardName=?;";
  db.query(sql, [req.query.boardName], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

app.put("/boardUpdate", (req, res) => {
  const {
    boardCode,
    boardCategory,
    boardName,
    boardBuilder,
    boardReadAllow,
    boardWriteAllow,
    boardCommentAllow,
    boardModifyAllow,
    boardIdx,
  } = req.body;

  let sql =
    "update boardManager set boardCode=?, boardCategory=?, boardName=?, boardBuilder=?, boardReadAllow=?, boardWriteAllow=?, boardCommentAllow=?, boardModifyAllow=?, modifyDate=now() where boardIdx = ?";
  db.query(
    sql,
    [
      boardCode,
      boardCategory,
      boardName,
      boardBuilder,
      boardReadAllow,
      boardWriteAllow,
      boardCommentAllow,
      boardModifyAllow,
      boardIdx,
    ],
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log("update complete");
        res.send({ status: 201, message: "게시판 수정 완료" });
      }
    }
  );
});

app.get("/board", (req, res) => {
  // console.log(req.query);
  let sql = "select * from board" + req.query.boardName + " order by idx desc;";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

app.post("/write", upload.single("img"), (req, res) => {
  const { title, writer, passwd, contents } = req.body;
  const { filename } = req.file;

  let sql =
    "insert into board" +
    req.query.boardName +
    " values(null, ?, ?, ?, ?, ?, 0, now());";
  db.query(sql, [title, writer, passwd, contents, filename], (err) => {
    if (err) {
      throw err;
    } else {
      console.log("write complete");
      res.send({ status: 201, message: "게시글 등록 완료" });
    }
  });
});

app.get("/view", (req, res) => {
  let sql = "select * from board" + req.query.boardName + " where idx = ?";
  db.query(sql, [req.query.idx], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
});

app.put("/update", upload.single("img"), (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  const { title, writer, passwd, contents } = req.body;
  const { filename } = req.file || "";

  let sql =
    "update board" +
    req.query.boardName +
    " set title=?, writer=?, passwd=?, contents=?, image=? where idx = ?";
  db.query(
    sql,
    [title, writer, passwd, contents, filename, req.query.idx],
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log("update complete");
        res.send({ status: 201, message: "게시글 수정 완료" });
      }
    }
  );
});

// 게시판 삭제
app.delete("/board/delete/:boardIdx", (req, res) => {
  let sql = "DELETE FROM boardManager WHERE boardIdx = ?;";
  db.query(sql, [req.params.boardIdx], (err) => {
    if (err) throw err;
    res.send({ status: 201, message: "게시판 삭제 완료" });
  });
});
// 게시글 삭제
app.delete("/delete/:boardName/:idx", (req, res) => {
  let sql = "DELETE FROM board" + req.params.boardName + " WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err) => {
    if (err) throw err;
    res.send({ status: 201, message: "게시글 삭제 완료" });
  });
});

// 다중게시판

// port
app.listen(process.env.PORT, () => {
  const dir = "uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  console.log("Server Running Port : " + process.env.PORT);
});
