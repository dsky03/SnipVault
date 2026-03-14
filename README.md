# 🔖 SnipVault
<img width="600" height="400" alt="Image" src="https://github.com/user-attachments/assets/ea929027-490b-4327-9053-ad8e5889fb15" />

## 🧭 개발 배경
프론트엔드 개발을 진행하다 보면 버튼, 모달, 폼 등 다양한 UI 컴포넌트를 반복적으로 구현하게 됩니다. 이 과정에서 이전에 작성했던 코드나 참고했던 UI를 다시 찾기 위해 GitHub, 블로그, 메모 등 여러 곳을 뒤져야 하는 경우가 많습니다. 그러나 이러한 방식은 코드가 여러 곳에 흩어져 관리되기 어렵고, 실제 동작을 확인하기 위해 별도의 프로젝트에 복사해 테스트해야 하는 번거로움이 있습니다.

또한 UI 예제나 코드 스티펫을 공유할 때 단순한 코드 테스트만으로는 실제 동작이나 스타일을 직관적으로 확인하기 어려워 협업이나 학습 과정에서 불편함이 발생합니다.

**SnipVault**는 이러한 문제를 해결하기 위해 UI 컴포넌트와 코드 스니펫을 한 곳에 저장하고 관리할 수 있도록 설계된 플랫폼입니다. 사용자는 UI 스니펫을 카테고리별로 탐색하고, 코드와 실제 실행 결과를 동시에 확인할 수 있어 필요한 UI를 빠르게 찾고 재사용할 수 있습니다.

## 📖 프로젝트 소개
**SnipVault**는 다양한 UI 컴포넌트와 코드 스티펫을 저장하고 관리할 수 있는 플랫폼으로, 개발자가 필요한 UI 예제를 빠르게 찾고 재사용할 수 있도록 설계된 사이트입니다. 코드와 실제 실행 결과를 동시에 확인할 수 있어 단순하고 코드 저장을 넘어 실질적인 UI 레퍼런스 라이브러리 역할을 합니다.

UI 스니펫 저장 및 관리
- 버튼, 카드, 모달, 폼 등 다양한 UI 컴포넌트를 스니펫 형태로 저장
- 카테고리 기반으로 UI를 체계적으로 분류
- 필요한 UI 코드를 한 곳에서 관리하고 재사용 가능

실시간 UI 미리보기
- 코드와 함께 실제 렌더링 결과를 동시에 확인 가능
- 실행 환경에서 UI 동작을 바로 확인할 수 있는 인터렉티브 프리뷰 제공
- UI 스타일과 동작을 빠르게 테스트할 수 있는 환경 제공

UI 탐색 및 검색
- 카테고리 기반 UI 탐색 기능 제공
- 제목 검색을 통해 원하는 UI 스니펫을 즉시 찾을 수 있는 구조
- 다양한 UI 예제를 한눈에 확인할 수 있도록 설계

개발 생상성 향상
- 반복적으로 구현되는 컴포넌트를 빠르게 참고하고 활용 가능
- UI 구현 시 참고할 수 있는 예제 라이브러리 역할
- 개발 과정에서 필요한 UI 패턴을 효율적으로 관리할 수 있는 구조


## 💻 주요 기능 (영상)

<details>
  <summary><b>회원가입 및 로그인</b></summary>
  <br />
  <blockquote>
    회원가입 및 로그인
  </blockquote>
  <br />
  <p align="center">
    <img src="https://github.com/user-attachments/assets/1926d8e0-c2b4-4ecc-84d8-083ed349ac45" alt="회원가입및로그인" height="400">
  </p>
  
  - 사이트에 접속하면 로그인 없이도 다른 사용자가 등록한 UI 스니펫을 확인할 수 있습니다.
  - 회원가입 버튼을 누르고 회원가입을 할 수 있습니다. (중복 닉네임 허용 x)
  - 로그인한 사용자는 자신이 작성한 스니펫을 모아 볼 수도 있고 관리할 수 있습니다.
</details>
<br />
  
<details>
  <summary><b>스니펫 생성</b></summary>
  <br />
  <blockquote>
    스니펫 생성
  </blockquote>
  <br />
  <p align="center">
    <img src="https://github.com/user-attachments/assets/a61c6cda-f7b6-45f7-adaf-608fd7784aeb" alt="스니펫생성" height="400">
  </p>

  - 버튼, 카드, 모달 등 다양한 UI 컴포넌트를 스니펫 형태로 저장할 수 있습니다.
  - 제목 카테고리, 설명과 함께 코드를 작성하여 관리합니다.
  - 코드를 붙여 놓으면 아래 프리뷰를 통해서 확인할 수 있습니다.
  - Tailwind CSS 유틸리티 클래스를 기반으로 스타일을 구성합니다.
</details>
<br />

<details>
  <summary><b>스니펫 카드</b></summary>
  <br />
  <blockquote>
    스니펫 카드
  </blockquote>
  <br />
  <p align="center">
    <img src="https://github.com/user-attachments/assets/6de0fff7-94ef-485e-8ef9-0d9349ddf28b" alt="스니펫카드" height="400">
  </p>
  
  - 스니펫 카드는 UI 프리뷰와 코드 화면을 버튼을 통해 전환하여 확인할 수 있습니다.
  - 카드 옵션 메뉴를 통해 상세 페이지 이동, 코드 복사, 수정 및 삭제 기능을 사용할 수 있습니다.
  - 코드 복사 버튼을 통해 스니펫 코드를 클립보드로 빠르게 복사할 수 있습니다.
  - 작성자는 자신의 스니펫에 대해 수정 및 삭제 작업을 수행할 수 있습니다.
  - 확장 버튼을 통해 스니펫 상세 페이지로 이동하여 더 큰 화면에서 확인할 수 있습니다.
</details>
<br />

<details>
  <summary><b>스니펫 관리</b></summary>
  <br />
  <blockquote>
    카테고리
  </blockquote>
  <br />
  <p align="center">
    <img src="https://github.com/user-attachments/assets/1581acd3-0ffe-433a-b04a-81d886a566a2" alt="카테고리" height="400">
  </p>

  - 버튼, 입력 필드, 드롭다운, 등 UI 컴포넌트 유형별 카테고리를 제공합니다.
  - 카테고리를 선택하면 해당 유형의 스니펫만 필터링하여 확인할 수 있습니다.
  - My 카테고리를 통해 자신이 작성한 스니펫만 모아 확인할 수 있습니다.
  - 각 카테고리에는 현재 등록된 스니펫 개수가 함께 표시됩니다.
  <br />
  
  <blockquote>
    스니펫 확장
  </blockquote>
    <br />
  <p align="center">
    <img src="https://github.com/user-attachments/assets/b3bcc353-6f96-4c8d-b2af-8a9b4c6097f5" alt="스니펫확장" height="400">
  </p>

  - 카드에서 확장 버튼을 누르면 스니펫 상세 페이지로 이동할 수 있습니다.
  - 상세 페이지에서는 큰 화면의 UI 프리뷰와 코드를 함께 확인할 수 있습니다.
  - 스니펫 설명, 작성자, 생성 및 수정 날짜 등의 정보를 확인할 수 있습니다.
  - 코드 실행 환경을 통해 UI 동작을 직접 확인할 수 있습니다.

  <br />
</details>
<br />

## 🛠️ 기술 스택
<p align="center">
  <img src="https://github.com/user-attachments/assets/2433db82-ed00-44d8-bcd4-d86f47d84ce8" alt="기술스택" height="200">
</p>
