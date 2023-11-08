import { useContext, useEffect, useState } from "react";
import { BodyNormal, BodySmall, HeadingLarge, HeadingSmall } from "../../text-wrapers/TextWrapers";
import Button from "../../Buttons";
import "../../../css/components/pages/office-details/lunch.css"
import { officeInformationData } from "../../../assets/OfficeInformationData";
import { redirect } from "react-router-dom";
import { IsAuth, RegisterLunchToday } from "../../../api/MicrosoftGraphAPI";
import CurrentOfficeContext from "../../../contexts/CurrentOfficeContext";
import { IActionResult } from "../../../api/Response";
import { IsRegistered } from "../../../api/LunchTodayAPI";
import { GetRegisteredDays, LunchRecurringItem, PutLunchRecurringItem } from "../../../api/LunchRecurringAPI";

async function LunchLoader(officeName: string) {
	const currentOfficeInformationData = officeInformationData[officeName]
	if (currentOfficeInformationData.canRegisterLunch == true) {
		if ((await IsAuth()).payload == true) {
			return null
		}
		else {
			return redirect(`/microsoft-auth?previousLocation=${encodeURI("/office-details/lunch")}`)
		}
	}
	throw redirect("/")
}

function Lunch() {
	const officeName = useContext(CurrentOfficeContext).currentOffice;
	const [response, setResponse] = useState<IActionResult<null> | null>(null)
	const [isRegisteredToday, setIsRegisteredToday] = useState<boolean>(true)
	const [registeredDays, setRegisteredDays] = useState<LunchRecurringItem>({
		Monday: false,
		Tuesday: false,
		Wednesday: false,
		Thursday: false,
		Friday: false,
	  });
	// const weekDaysNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

	useEffect(() => {
		const IsRegisteredWrapper = async () => {
			const isRegisteredRes = await IsRegistered();
			if (isRegisteredRes.payload == undefined)
			{
				setIsRegisteredToday(true);
			}
			else{
				setIsRegisteredToday(isRegisteredRes.payload);
			}
		}
		const GetRegisteredDaysWrapper = async () => {
			const registeredDaysRes = await GetRegisteredDays();
			console.log(registeredDaysRes)
			if (registeredDaysRes.payload !== undefined)
			{
				setRegisteredDays(registeredDaysRes.payload);
			}
		}
		IsRegisteredWrapper();
		GetRegisteredDaysWrapper();
	  }, []);

	const handleCheckboxChange = (dayName: keyof LunchRecurringItem) => {
		const updatedCheckedBoxes = {...registeredDays};
		updatedCheckedBoxes[dayName] = !updatedCheckedBoxes[dayName];
		setRegisteredDays(updatedCheckedBoxes);
	};
	const saveLunchDays = async () => {
		await PutLunchRecurringItem(registeredDays);
	};
	const registerForToday = async () => {
		if(!isPastNoon())
		{
			setIsRegisteredToday(true);
			const response = await RegisterLunchToday(RegisterForTodayMail(officeName));
			// const response = await CreateEvent("grzegorz.malisz@weareida.digital", "lunch event", new Date().toISOString(), new Date().toISOString());
			// setResponse(await SendEmail(RegisterForTodayMail(officeName), "office@ida-mediafoundry.nl"));
			setResponse(response);
			if (!response.success)
			{
				setIsRegisteredToday(false);
			}
		}
	};

	return (
		<div className="content">
			<div className="description">
				<HeadingLarge>Lunch</HeadingLarge>
				<BodyNormal>Don't forget to register!</BodyNormal>
			</div>
			<main className="lunch-main">
				<div className="lunch-main__recurring">
					<HeadingSmall>Register recurring</HeadingSmall>
					<BodySmall>Information will be sent</BodySmall>
					<BodySmall>before 12:00 on the mentioned day</BodySmall>
					<form className="lunch-main__form body--normal">
						{Object.keys(registeredDays).map((dayName, index) => (
							<div className="lunch-main__form__checkboxes" key={dayName}>
								<input
									type="checkbox"
									checked={registeredDays[dayName as keyof LunchRecurringItem]}
									onChange={() => handleCheckboxChange(dayName as keyof LunchRecurringItem)}
									id={dayName}
								/>
								<label key={dayName} htmlFor={dayName}>
									{dayName}
								</label>
							</div>
						))}
					</form>
					<Button child="Save" onClick={saveLunchDays} />
				</div>
				<div className="lunch-main__today">
					<HeadingSmall>Register for today</HeadingSmall>
					<BodySmall>Only for today</BodySmall>
					<BodySmall>before 12:00</BodySmall>
					{response && <BodySmall additionalClasses={[response.success ? "font-colour--success" : "font-colour--fail"]}>{response.status}</BodySmall>}
					<form>
						<Button child="Register" disabled={isPastNoon() || isRegisteredToday} onClick={() => registerForToday()} />
					</form>
				</div>
			</main>
		</div>
	);
}

function RegisterForTodayMail(officeName: string) {
	const message = `Hi,
I would like to register for today's lunch at ${officeName} Office.
Kind Regards`
	return message
}

function isPastNoon(): boolean {
	const currentTime = new Date();
	const currentHours = currentTime.getHours();

	// Compare the current hours with 12 (noon)
	return currentHours >= 12;
}

export default Lunch;
export { LunchLoader };