import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast, Button } from 'react-bootstrap';
import {
	MDBContainer,
	MDBRow,
	MDBCol,
	MDBCard,
	MDBCardBody,
} from "mdb-react-ui-kit";
import "./style.css";

const ControlPage = () => {
	const navigate = useNavigate();
	const startButtonName = localStorage.getItem("buttonName");
	const [buttonName, setButtonName] = useState(startButtonName);
	const [blackListTokenAdress, setBlackListTokenAdress] = useState("");
	const [showToast, setToast] = useState(false);

	const handleClickStartButton = () => {
		console.log("start button clicked");
		setButtonName("Stop");
		localStorage.setItem("buttonName", "Stop");
	};

	const handleClickStopButton = () => {
		console.log("stop button clicked");
		setButtonName("Start");
		localStorage.setItem("buttonName", "Start");
	};

	const handleClick = async () => {
		try {
			const response = await fetch("http://ec2-3-15-102-164.us-east-2.compute.amazonaws.com/mainPage", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: buttonName,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const result = await response.json();

			if (result.message === "Success") {
				buttonName === "Start"
					? handleClickStartButton()
					: handleClickStopButton();
			} else {
				navigate("/");
			}
		} catch (error) {
			console.error("Error posting data:", error);
		}
	};

	const handleClickAddBlackList = async () => {
		if (blackListTokenAdress.length !== 42) return;
		try {
			const response = await fetch("http://ec2-3-15-102-164.us-east-2.compute.amazonaws.com/mainPage", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					status: "AddBlackList",
					tokenAdress: blackListTokenAdress
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const result = await response.json();

			if (result.message === "Success") {
				console.log("Success!");
				setBlackListTokenAdress("");
				setToast(true);
			} else {
				navigate("/mainPage");
			}
		} catch (error) {
			console.error("Error posting data:", error);
		}
	}

	const handleChange = async (e) => {
		setBlackListTokenAdress(e.target.value);
	}

	return (
		<MDBContainer fluid>
			<MDBRow className="d-flex justify-content-center align-items-center h-100">
				<MDBCol col="10">
					<MDBCard
						className="bg-dark text-white my-200 mx-auto"
						style={{ borderRadius: "1rem", maxWidth: "1000px" }}
					>
						<MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
							<button
								className="mx-2 px-5 fs-5 btn btn-1 btn-outline-primary"
								onClick={handleClick}
							>
								{buttonName}
							</button>
						</MDBCardBody>
						<MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
							<input type="text" value={blackListTokenAdress} onChange={(e) => setBlackListTokenAdress(e.target.value)} className="form-control w-100 my-5 fs-5" placeholder="Enter token adress" />
							<button
								className="mx-2 px-5 fs-5 btn btn-1 btn-outline-primary"
								onClick={handleClickAddBlackList}
							>
								{"AddBlackList"}
							</button>
						</MDBCardBody>
					</MDBCard>
				</MDBCol>
				<MDBCol col="2" className="d-flex justify-content-end align-items-start position-fixed w-100" style={{ top: '20px', right: '20px', zIndex: 9999 }}>
					<Toast
						onClose={() => setToast(false)}
						autohide
						show={showToast}
						delay={3000}
						style={{backgroundColor: "rgb(0, 176, 80)", borderRadius: "10px", color: "white", fontSize: "16px"}}
					>
						<Toast.Header style={{height: "70px", borderRadius: "10px", backgroundColor: "rgb(0, 176, 80)"}}>
							<strong className="mr-auto"> ✔ Successfully added in blacklist! </strong>
						</Toast.Header>
					</Toast>
				</MDBCol>
			</MDBRow>
		</MDBContainer>
	);
};

export default ControlPage;
