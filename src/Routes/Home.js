import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate here
import styles from '../Css/Home.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsSearch } from 'react-icons/bs';

import chicken from '../Images/chicken.jpg';
import meet from '../Images/meet.jpg';
import noodle from '../Images/noodle.jpg';
import pizza from '../Images/pizza.jpg';
import soup from '../Images/soup.jpg';
import darkLogo from '../Logo/darkLogo.png';

function Home() {
	const navigate = useNavigate(); // Initialize navigate using useNavigate
	const images = [chicken, noodle, pizza, soup, meet]; // 이미지 배열
	const [currentImage, setCurrentImage] = useState(null);

	// 'About Us' 섹션을 위한 ref
	const aboutUsRef = useRef(null);

	// 모든 이미지를 미리 로드하여 캐시
	useEffect(() => {
		// 이미지 미리 로드
		images.forEach((image) => {
			const img = new Image();
			img.src = image;
		});

		// 랜덤 이미지 선택
		const randomImage = images[Math.floor(Math.random() * images.length)];
		setCurrentImage(randomImage);
	}, []); // 빈 배열을 두 번째 인자로 넣어 한 번만 실행되게 설정

	// 'About Us' 클릭 시 해당 섹션으로 스크롤
	const scrollToAboutUs = () => {
		if (aboutUsRef.current) {
			aboutUsRef.current.scrollIntoView({
				behavior: 'smooth',
			});
		}
	};

	// 'JMC' 클릭 시 홈 화면으로 네비게이트
	const refreshPage = () => {
		window.location.reload(); // 페이지 새로고침
	};

	return (
		<div className={styles.content}>
			<nav className={styles.upBar} id={styles.hd}>
				<img src={darkLogo} onClick={refreshPage} />
				{/* 'About Us' 클릭 시 scrollToAboutUs 호출 */}
				<h3 onClick={scrollToAboutUs}>about us</h3>
			</nav>

			<section
				className={styles.body}
				id={styles.bg}
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.527), rgba(0, 0, 0, 0.5)),url(${currentImage})`,
				}} // 랜덤 이미지 적용
			>
				<h1 className={styles.cp}>
					다양한 음식을
					<br />
					비교하여 선정하세요.
				</h1>
				<div className={styles.searchBar}>
					<input
						type="text"
						placeholder="메뉴, 식당 이름을 입력해주세요"
						className={styles.searchInput}
					/>
					<button
						onClick={() => {
							navigate('/Map'); // Use navigate here to go to '/Map'
						}}
					>
						<BsSearch className={styles.searchIcon} />
					</button>
				</div>
				<button
					className={styles.goRoullete}
					onClick={() => {
						navigate('/Roulette'); // Use navigate here to go to '/Roulette'
					}}
				>
					룰렛 돌리기
				</button>
				<button
					className={styles.aiConsultBtn}
					onClick={() => {
						navigate('/AiConsult');
					}}
				>
					ai 상담하기
				</button>
			</section>

			{/* 'About Us' 섹션, ref를 통해 스크롤 대상 지정 */}
			<section ref={aboutUsRef} className={styles.aboutUs}>
				<div className={styles.secondBody}>
					<h2>About Us</h2>
					<p>점메추는 저희가 고심해서 만들어낸 어쩌고 입니다.</p>
					<h3>박승현 바보</h3>
				</div>
			</section>
		</div>
	);
}

export default Home;
