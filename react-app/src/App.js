import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

function Home() {
  return <h1>Home Page</h1>;
}

function About() {
  return <h1>About Page</h1>;
}

function Contact() {
  const navigate = useNavigate(); // 프로그래밍 방식으로 이동
  return (
    <div>
      <h1>Contact Page</h1>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
}

function App() {

  useEffect(() => {
    // 여기에 실행할 코드 작성
    console.log('Component has rendered or updated');

    const ipcRenderer = window.require('electron').ipcRenderer;
    const version = document.querySelector("#version");

    ipcRenderer.send("app_version"); // app_version 채널로 송신
    // app_version 채널에서 송신
    ipcRenderer.on("app_version", (event, data) => { 
        // event 모두 종료 후 다음 코드 실행
      ipcRenderer.removeAllListeners("app_version");
        // 업데이트가 필요한 경우 현재 버전을 알려주는 메시지입니다.
      version.innerText = `현재 버전:  ${data.version}`;
    });

    const notification = document.querySelector(".notification");
    const message = document.querySelector(".update-message");
    const closeButton = document.querySelector("#close-button");
    const restartButton = document.querySelector("#restart-button");

    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      message.innerText = "업데이트 파일을 다운로드 중입니다...";
      notification.classList.remove("hidden");
    });

    // update_downloaded 채널로 송/수신
    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
        // 업데이트 완료 후 해당 메시지를 보여줍니다.
      message.innerText =
        "업데이트 파일 다운로드를 마쳤습니다. \n 재시작을 하면 업데이트 버전이 실행됩니다. \n 재시작 하시겠습니까?";
        // 닫기 / 재시작 버튼을 렌더링합니다.
      restartButton.classList.remove("hidden");
      notification.classList.remove("hidden");
    });

    function closeNotification() {
      notification.classList.add("hidden");
    }
    function restartApp() {
      ipcRenderer.send("restart_app");
    }

    closeButton.addEventListener("click", closeNotification);
    restartButton.addEventListener("click", restartApp);

    // 선택적으로 클린업(cleanup) 함수를 반환
    return () => {
      console.log('Component will unmount or re-run useEffect');
    };
  });

  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <div>
        version: 1.1
      </div>

      <div class="notification hidden">
        <div class="notification-modal">
          <h2 class="modal-title"> 업데이트 안내 </h2>
          <h2 id="version"> </h2>
          <p class="update-message"></p>
          <div class="updater-btn-wrapper">
            <button id="close-button" class="btn btn-secondary hidden"> 닫기 </button>
            <button id="restart-button" class="btn btn-primary hidden"> 재시작 </button>
          </div>
        </div>
      </div>
      <div class="loading-wrapper hidden">
        <div class="loading-container">
          <div class="loading"></div>
          <div id="loading-text">loading</div>
        </div>
      </div>
      
    </Router>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
