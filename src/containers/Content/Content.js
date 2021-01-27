import React, {Component} from 'react';
import { Main } from '../../components';
import { Login } from '../../components';

import * as service from '../../service/babelfish';

class Content extends Component {
    state = {
        viewid : 0, // 미로그인 : 0, 로그인성공 : 1, 
        api_fetching : false, // 질의가 진행중일경우 true
        error : false, // 에러가 발생했을경우
        error_msg : "", //  에러 메시지 코드
        userid : "", //유저 아이디
        notes : {} //보유 노트 리스트
    }
    // 로그인 컴포먼트 pressedLoginButton 이벤트의 처리
    logindataManipulation = async(data) => {
        //console.log(`데이터 연결 정상`);
        //console.log(data);
        try {
            this.setState({api_fetching:true});// 질의 진행 상태설정

            const post = await service.getToken(data.email,data.password); //질의
            sessionStorage.setItem("token", post.data.token); // 토큰정보 세션에 저장

            //console.log(sessionStorage.getItem("token")); // 토큰정보 출력
            this.setState({viewid : 1,api_fetching : false, error:false, error_msg:"",userid:data.email});// 질의 성공 상태설정
        }catch (error){
            if (error.response) {
                // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                //console.log(error.response.data); // 서버응답
                //console.log(error.response.status); //400
                //console.log(error.response.headers);
                this.setState({api_fetching : false, error:true, error_msg:error.response.data.msg_code});// 질의 진행 상태설정
              }
              else if (error.request) {
                // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                // Node.js의 http.ClientRequest 인스턴스입니다.
                //console.log(error.request);
                this.setState({api_fetching : false, error:true, error_msg:"api_server_offline"});// 질의 진행 상태설정
              }
              else {
                // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                console.log('Error', error.message);
                this.setState({api_fetching : false, error:true, error_msg:"front_server_error"});// 질의 진행 상태설정
              }
              console.log(error.config);
        }
        //console.log(`분기완료 상태 출력`);
        //console.log(this.state);
    }
    // 메인 컴포먼트 노트 리스트 동기화 처리
    userNoteDataLoad = async()=>{
        try {
            //TODO
            //1.상태 설정 - 질의 진행중
            //2.API 통신 진행
            //3.상태 설정 - 질의 종료 및 데이터 동기화
            console.log(`시작`);
            //1.상태 설정 - 질의 진행중
            this.setState({api_fetching:true});
            //2.API 통신 진행
            const get = await service.getNotes(sessionStorage.getItem("token"),this.state.userid);
            //3.상태 설정 - 질의 종료 및 데이터 동기화
            this.setState({api_fetching : false, error:false, error_msg:"", notes:get.data.data});
            //console.log(get.data.data); //단어장 리스트

        }catch(error){
            // 토큰정보가 유효하지 않을경우 로그인창으로
            if (error.response) {
                // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                //console.log(error.response.data); // 서버응답
                //console.log(error.response.status); //400
                //console.log(error.response.headers);
                this.setState({api_fetching : false, error:true, error_msg:error.response.data.msg_code});// 질의 진행 상태설정
              }
              else if (error.request) {
                // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                // Node.js의 http.ClientRequest 인스턴스입니다.
                //console.log(error.request);
                this.setState({api_fetching : false, error:true, error_msg:"api_server_offline"});// 질의 진행 상태설정
              }
              else {
                // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                console.log('Error', error.message);
                this.setState({api_fetching : false, error:true, error_msg:"front_server_error"});// 질의 진행 상태설정
              }
              console.log(error.config);
        }
        console.log(`종료`);
        //console.log(`분기완료 상태 출력`);
        //console.log(this.state);
    }
    // 모든 컴포넌트 뷰아이디 상태변경 처리
    changeViewId = (value) => {
      this.setState({viewid: Number(value)});
      console.log(this.state);
    }
    render() {
        return (
            <div>
            {this.state.viewid === 0 && (<Login sendData={this.logindataManipulation} />)/*로그인 필요시*/}

            {this.state.viewid >= 1 && (<Main 
            getNote={this.userNoteDataLoad}  // 노트 리스트 동기화
            NotesData={this.state.notes}  // 노트 리스트 데이터
            api_fetching={this.state.api_fetching} // api 질의 진행 상태
            changeViewId={this.changeViewId} // 뷰 상태 데이터 변경
            viewId={this.state.viewid} // 뷰 상태 데이터
            />)}
            </div>
        );
    }
}

export default Content;