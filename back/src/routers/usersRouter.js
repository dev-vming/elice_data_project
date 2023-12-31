const usersRouter = require("express").Router();
const usersService = require("../services/usersService.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const { cookieOption, cookieOption2 } = require("../lib/cookieOption.js");
const {
  INVALID_USER_Error,
  BadRequestError,
} = require("../lib/custom-error.js");
const userService = require("../services/usersService.js");
const upload = require("../middlewares/multer");
const bcrypt = require("bcrypt");

// GET /login
usersRouter.post("/login", async (req, res, next) => {
  try {
    // 요청 바디 데이터 받아오기
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("필수적인 정보가 입력되지 않았습니다");
    }

    // email로 사용자 정보 가져오기
    const user = await usersService.getUserByEmail(email);
    // password 검증
    const isPwCorrect = await usersService.verifyPassword(user, password);
    if (!isPwCorrect) throw new INVALID_USER_Error("잘못된 비밀번호입니다.");
    // jwt 생성
    const accessToken = await usersService.getAccessToken(user);
    // cookie 전송
    res.cookie("accessToken", accessToken, cookieOption);

    // 응답
    res.status(200).json({
      message: "로그인 성공",
      user: {
        username: user.username,
        email: user.email,
        level: user.level,
        img_url: user.img_url,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /logout
usersRouter.get("/logout", isLoggedIn, async (req, res, next) => {
  try {
    res.cookie("accessToken", "", cookieOption2);
    res.status(200).json({
      message: "로그아웃 성공",
    });
  } catch (err) {
    next(err);
  }
});

// GET /user
usersRouter.get("/user", isLoggedIn, async (req, res, next) => {
  try {
    // 요청 쿠키 데이터 가져오기
    const user_id = req.currentUserId;

    // user_id로 사용자정보 가져오기
    let [user] = await usersService.getUserById(user_id);
    const level = await userService.setAndgetUserLevel(user_id);
    console.log("Router", level);
    user.level = level;

    // 응답
    res.status(200).send({
      message: "DB 데이터 조회 성공",
      user,
    });
  } catch (err) {
    next(err);
  }
});

// GET
usersRouter.get("/", async (req, res, next) => {
  try {
    // 요청 바디 데이터 가져오기
    const user_id = req.query.userId;
    const limit = req.query.limit;
    // 모든 사용자 데이터 가져오기
    let users = await userService.getUsers(user_id, limit);

    // 응답
    res.status(200).send({
      message: "DB 데이터 조회 성공",
      users,
    });
  } catch (err) {
    next(err);
  }
});

// POST
usersRouter.post("/", async (req, res, next) => {
  try {
    // 요청 바디 데이터 가져오기
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new BadRequestError("필수적인 정보가 입력되지 않았습니다");
    }

    // 새로운 사용자 추가
    await usersService.addUser(username, email, password);

    //응답
    res.status(200).send({
      message: "DB 데이터 추가 성공",
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE
usersRouter.put(
  "/",
  isLoggedIn,
  upload.single("file"),
  async (req, res, next) => {
    try {
      // 요청 쿠키, 바디에서 값 받아오기
      const user_id = req.currentUserId;
      let { username, password } = req.body;
      if (!username && !password) {
        throw new BadRequestError("업데이트할 정보를 전달해주세요!");
      }

      if (password) {
        password = await bcrypt.hash(password, 10);
      }

      const img_url = req.file ? req.file.location : "";
      const toUpdate = { username, password, img_url };
      // 현재 사용자 정보 수정하기
      await usersService.setUser(user_id, toUpdate);

      // 응답
      res.status(200).send({
        message: "DB 데이터 수정 성공",
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE
usersRouter.delete("/", isLoggedIn, async (req, res, next) => {
  try {
    // cookie에서 user_id 받아오기

    const user_id = req.currentUserId;

    // 현재 사용자 데이터 삭제
    await usersService.deleteUserInfoById(user_id);

    //응답
    res.status(200).send({
      message: "DB 데이터 삭제 성공",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
