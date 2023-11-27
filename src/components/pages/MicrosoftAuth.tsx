import { useSearchParams } from 'react-router-dom';
import Button from "../Buttons";
import { BodyNormal, HeadingLarge } from "../text-wrapers/TextWrapers";
import { useNavigate } from "react-router-dom";
import { IsAuth } from '../../api/MicrosoftGraphAPI';
import { useEffect, useState } from 'react';

function MicrosoftAuth() {
	const [popupLogin, setPopupLogin] = useState<Window | null>();
	const navigate = useNavigate();

	useEffect(() => {
		const IsAuthWrapper = async () => {
			if ((await IsAuth()).payload) {
				navigate("/")
			}
		};
		IsAuthWrapper();
	}, []);

	useEffect(() => {
		// Check if the popup is closed at regular intervals
		const checkPopupClosed = setInterval(async () => {
			if (popupLogin?.closed) {
				// if popup is closed check if the user is loged in
				if ((await IsAuth()).payload) {
					// if loged in navigate to adequat website
					navigate(previousLocation)
				}
				clearInterval(checkPopupClosed);
			}
		}, 1000);

		// Cleanup the interval when the component is unmounted
		return () => clearInterval(checkPopupClosed);
	}, [popupLogin]);

	const openPopup = () => {
		setPopupLogin(window.open(`http://localhost:3002/microsoft/auth?route=${encodeURI(previousLocation)}`, '_blank', 'width=500,height=600'));
	};

	// Get the search parameters from the URL
	const [searchParams] = useSearchParams();

	// Access specific query parameters
	const queryPreviousLocation = searchParams.get('previousLocation');
	const previousLocation = queryPreviousLocation ? queryPreviousLocation : "/microsoft-auth";

	return (
		<div className="content">
			<div className="description">
				<HeadingLarge>Login with your</HeadingLarge>
				<HeadingLarge>Microsoft Account</HeadingLarge>
				<BodyNormal>Get access to all the benefits of app!</BodyNormal>
			</div>
			<main className="microsoft-auth-main">
				<Button child="Log in" onClick={() => openPopup()} />
			</main>
		</div>
	);
}

export default MicrosoftAuth;
