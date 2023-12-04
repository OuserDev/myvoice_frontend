const express = require('express');
const router = express.Router();
const db = require('../server/models/database');
const path = require('path');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // 'index.html' 파일의 경로를 설정하세요.
});

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const confirm_password = req.body.passwordReconfirm;
        const email = req.body.email;

        // 비밀번호 확인
        if (password !== confirm_password) {
            return res.status(400).send('Passwords do not match.');
        }

        // username이 이미 존재하는지 확인
        const userCheckQuery = 'SELECT * FROM signup WHERE username = ?';
        const userData = await new Promise((resolve, reject) => {
            db.query(userCheckQuery, [username], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (userData.length > 0) {
            console.log("이미 존재하는 아이디야");
            return res.status(400).send('이미 존재하는 아이디 입니다.');
        }

        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, 10);

        // 데이터베이스에 사용자 정보 저장
        const query = 'INSERT INTO signup (username, password, email) VALUES (?, ?, ?)';
        db.query(query, [username, hashedPassword, email], (err, results) => {
            if (err) {
                throw err;
            }

            res.send(`User ${username} registered with email ${email}`);
            console.log("윤딕건 회원가입 성공");
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // 'index.html' 파일의 경로를 설정하세요.
    console.log('get요청은됨');
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 데이터베이스에서 사용자 검색
        const query = 'SELECT * FROM signup WHERE username = ?';
        const [users] = await db.query(query, [username]);

        // 사용자가 존재하지 않으면 에러 처리
        if (users.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        // 비밀번호 확인
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
            // 세션에 사용자 정보 저장
            req.session.user = { id: user.id, username: user.username };
            console.log("로그인 성공함: ", username);

            // 클라이언트에 성공 응답 전송
            res.send('Login successful');
        } else {
            // 로그인 실패 처리
            return res.status(401).send('Invalid username or password');
        }
        // 로그인 성공 처리
        console.log("로그인 성공함: ", username)

        // 세션 얹어서 뷰단에 보내기
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/logout', (req, res) => {
    // 세션을 사용하는 경우 세션 정보를 삭제
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                // 세션 삭제 중 에러 처리
                return res.status(500).send('Logout failed');
            }

            // 로그아웃 성공 처리
            res.send('Logged out successfully');
        });
    } else {
        // JWT 토큰을 사용하는 경우, 클라이언트에서 토큰을 삭제하거나 무효화 처리
        res.send('Logged out successfully');
    }
});

module.exports = router;