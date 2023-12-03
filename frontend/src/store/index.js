import { createStore } from 'vuex'
import axios from "axios";

export default createStore({
  state(){
		return {
			로그인창상태: 0,
      convert_status: 1,
      회원가입창상태: 0,
      보이스셋리스트: [],
      isLoggedIn: false,
      userInfo: {},
		}
	},
  getters: {
  },
  mutations: {
    로그인창열기(state) {
      if (state.회원가입창상태 === 1) {
        state.회원가입창상태 = 0
        setTimeout(() => {
          if (state.로그인창상태 == 0) {
            state.로그인창상태 = 1
          } 
        }, 500);
      } else {
      if (state.로그인창상태 == 0) {
        state.로그인창상태 = 1
      } else if (state.로그인창상태 == 1) {
        state.로그인창상태 = 0
    }};
  },
    회원가입창열기(state) {
      if (state.로그인창상태 === 1) {
        state.로그인창상태 = 0
        setTimeout(() => {
          if (state.회원가입창상태 == 0) {
            state.회원가입창상태 = 1
          } 
        }, 500);
      } else {
      if (state.회원가입창상태 == 0) {
        state.회원가입창상태 = 1
      } else if (state.회원가입창상태 == 1) {
        state.회원가입창상태 = 0
    }};
  },
    set보이스셋리스트 (state,data) {
      state.보이스셋리스트 = data.data;
      // console.log('set보이스셋리스트가 호출되었습니다:', state.보이스셋리스트);
    },
    로그인창닫기(state, data) {
      state.로그인창상태 = 0
    },
    setLoginState(state, status) {
      state.isLoggedIn = status;
    },
    setUserInfo(state, status) {
      state.userInfo = status;
    }
},
  actions: {
    get보이스셋리스트(context) {
      // actions에서 commit을 사용할거면, context를 parameter로 받아야함
        axios
        .get('/data.json')
        .then(response => {
          // console.log(response.data);
          // console.log("성공");
          context.commit('set보이스셋리스트', response.data);
        })
        .catch(error => {
          console.log("데이터 불러오기 실패");
        });
      },
    test() {
      axios
      .get("https://19b4a6d6-f894-4563-a86c-2d6760ce7a2d.mock.pstmn.io/list")
      .then(response => {
        console.log("성공",response.data);
      })
      .catch(error => {
        console.log("실패");
      });
    },
    로그인전송(context, credentials) {
      return axios
      // .post(`${process.env.VUE_APP_BACKEND_URL}/auth/login`, credentials)
      .post(`https://19b4a6d6-f894-4563-a86c-2d6760ce7a2d.mock.pstmn.io/auth/login`, credentials)
      .then(response => {
        const userInfo = response.data.user;
        context.commit('setLoginState', document.cookie.includes('sessionId'));
        console.log('setLoginState:', context.state.isLoggedIn);
        context.commit('setUserInfo', userInfo);
        console.log('setUserInfo:', context.state.userInfo);
        return userInfo;
      })
      .catch(error => {
        console.error('로그인전송 오류',error);
        throw error;
      });
    },

    회원가입전송(context, userData) {
      return axios
      // .post(`${process.env.VUE_APP_BACKEND_URL}/auth/register`, userData)
      .post(`https://19b4a6d6-f894-4563-a86c-2d6760ce7a2d.mock.pstmn.io/auth/register`, userData)
      .then(response => {
        context.commit('로그인창열기');
      })
      .catch(error => {
        console.error('회원가입전송 오류',error);
        throw error;
      });
    },
  },
  
  modules: {
  }
})