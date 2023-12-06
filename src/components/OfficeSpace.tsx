import "../css/components/office-space.css";
import {
    BodySmall,
} from "./text-wrapers/TextWrapers";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Button from "./Buttons";
import { useContext, useEffect, useState } from "react";
import CurrentOfficeContext from "../contexts/CurrentOfficeContext";
import { GetDeskReservationForOfficeDate, GetDeskReservationsOfUser, IDesk, IDeskReservation, PostDeskReservation } from "../api/DeskReservationAPI";

export class Desk {
    clusterId: string
    deskId: string;
    occupied: boolean[];
    userReservations: boolean[];
    isSelected: boolean;

    constructor(clusterId: string, deskId: string, occupied: boolean[]) {
        this.clusterId = clusterId;
        this.deskId = deskId;
        this.occupied = occupied;
        this.isSelected = false;
        this.userReservations = new Array(occupied.length).fill(false);
    }

    getState(): number {
        let amountOfOccupied = 0;
        for (const timeSlot of this.occupied) {
            if (timeSlot) amountOfOccupied++;
        }

        if (this.isSelected) return 1
        if (amountOfOccupied == this.occupied.length) return 3
        if (amountOfOccupied == 0) return 0
        else return 2
        return -1
    }
}
class DeskCluster {
    clusterId: string;
    desks: { [key: string]: Desk };

    constructor(clusterId: string, iDesks: IDesk[]) {
        this.clusterId = clusterId;
        this.desks = {}
        for (const deskId in iDesks) {
            this.desks[deskId] = new Desk(iDesks[deskId].clusterId, iDesks[deskId].deskId, iDesks[deskId].occupied)
        }
    }
}

function OfficeSpace() {
    const officeName = useContext(CurrentOfficeContext).currentOffice;
    const [displayedDate, setDisplayedDate] = useState(new Date());
    const [selectedDesk, setSelectedDesk] = useState<Desk | undefined>(undefined);
    const [checkboxValues, setCheckboxValues] = useState([false, false]);
    const [initialDeskClusters, setInitialDeskClusters] = useState<{ [key: string]: DeskCluster }>({})
    const [deskClusters, setDeskClusters] = useState<{ [key: string]: DeskCluster }>(initialDeskClusters)
    const [userReservations, setUserReservations] = useState<IDeskReservation[]>([])

    useEffect(() => {
        SetUpOfficeSpace();
    }, [])

    const SetUpOfficeSpace = async (date?: Date) => {

        const reservations = await GetDeskReservationForOfficeDate(officeName, date ? date : displayedDate);

        const newDeskClusters: { [key: string]: DeskCluster } = {};

        if (reservations.payload) {
            for (const clusterId in reservations.payload) {
                newDeskClusters[clusterId] = new DeskCluster(clusterId, reservations.payload[clusterId].desks)
            }
        }

        // Handle user reservations
        if(userReservations.length > 0)
        {
            for (const userReservation of userReservations) {
                newDeskClusters[userReservation.clusterId].desks[userReservation.deskId].userReservations[userReservation.timeSlot] = true;
            }
        }
        else
        {
            const userReservationsResponse = await GetDeskReservationsOfUser(officeName)
            if(userReservationsResponse.payload)
            {
                setUserReservations(userReservationsResponse.payload)
                for (const userReservation of userReservationsResponse.payload) {
                    newDeskClusters[userReservation.clusterId].desks[userReservation.deskId].userReservations[userReservation.timeSlot] = true;
                }
            }
        }

        setDeskClusters(newDeskClusters);
        setInitialDeskClusters(newDeskClusters);
    }

    const PreviousDay = async () => {
        const newDate = new Date(displayedDate);
        const PreviousDayDate = new Date(newDate.setDate(newDate.getDate() - 1));
        if (
            new Date() < PreviousDayDate ||
            (new Date().getFullYear() == newDate.getFullYear() &&
                new Date().getMonth() == newDate.getMonth() &&
                new Date().getDate() == newDate.getDate())
        ) {
            setDisplayedDate(PreviousDayDate);
            await SetUpOfficeSpace(PreviousDayDate)
        }
    };
    const NextDay = async () => {
        const newDate = new Date(displayedDate);
        const NextDayDate = new Date(newDate.setDate(newDate.getDate() + 1));

        // To calculate the time difference of two dates 
        const differenceInTime = new Date().getTime() - NextDayDate.getTime();

        // To calculate the no. of days between two dates 
        const differenceInDays = Math.abs(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays <= 14) {
            setDisplayedDate(NextDayDate);
            await SetUpOfficeSpace(NextDayDate)
        }
    };

    const selectDesk = (desk: Desk) => {
        if (selectedDesk)
            selectedDesk.isSelected = false;

        if (selectedDesk?.clusterId == desk.clusterId && selectedDesk?.deskId == desk.deskId) {
            // Reset the state with the default values
            setDeskClusters(initialDeskClusters);
            setSelectedDesk(undefined)
            setCheckboxValues([false, false])
        }
        else if (desk.getState() == 0 || desk.getState() == 2) {
            const updatedDeskClusters = { ...initialDeskClusters };

            // Toggle the class for the selected desk
            updatedDeskClusters[desk.clusterId].desks[desk.deskId].isSelected = true;

            // Update the state with the modified deskClusters, selected desk, checkboxes
            setDeskClusters(updatedDeskClusters);
            setSelectedDesk(desk)
            setCheckboxValues(desk.occupied)
        }
    };

    const handleCheckboxChange = (index: number) => {
        const updatedCheckedBoxes: boolean[] = [...checkboxValues];
        updatedCheckedBoxes[index] = !updatedCheckedBoxes[index];
        setCheckboxValues(updatedCheckedBoxes);
    };

    const GetData = () => {
        const timeSlots: number[] = [];
        for (let i = 0; i < checkboxValues.length; i++) {
            if(selectedDesk?.occupied[i] != checkboxValues[i]) timeSlots.push(i)
        }
        if (selectedDesk)
        {
            PostDeskReservation(officeName, displayedDate, selectedDesk?.clusterId, selectedDesk?.deskId, timeSlots)
        }
    }

    return (
        <div className="office-space body--normal">
            <div className="office-space__date-picker">
                <div className="office-space__date-picker__arrows" onClick={PreviousDay}>
                    <KeyboardArrowLeftIcon fontSize="inherit" />
                </div>
                <div className="office-space__date-picker__date">
                    {displayedDate.toLocaleDateString()}
                </div>
                <div className="office-space__date-picker__arrows" onClick={NextDay}>
                    <KeyboardArrowRightIcon fontSize="inherit" />
                </div>
            </div>
            <div className="office-space__overview">
                {Object.keys(deskClusters).map((index) => (
                    <DeskClusterComponent desks={deskClusters[index].desks} clusterId={deskClusters[index].clusterId} selectDesk={selectDesk} key={deskClusters[index].clusterId} />
                ))}
            </div>
            <div className="office-space__availability-bar">
                {selectedDesk &&
                    <>
                        <div className="availability-bar__times">
                            <BodySmall children="Morning" />
                            <BodySmall children="Afternoon" />
                        </div>
                        <div className="availability-bar__bars">
                            {selectedDesk.occupied.map((isOccupied, index) => (
                                <div className={`availability-bar__bar availability-bar__bar${!isOccupied ? "--success" : "--fail"}`} key={index}></div>
                            ))}
                        </div>
                        <form className="availability-bar__form body--normal">
                            {selectedDesk.occupied.map((isOccupied, index) => {
                                const onChange = () => {
                                    handleCheckboxChange(index);
                                    // Add your checkbox change logic here
                                };

                                return (
                                    <div className="availability-bar__checkboxes" key={index} id={index.toString()}>
                                        <input
                                            type="checkbox"
                                            checked={checkboxValues[index]}
                                            disabled={isOccupied}
                                            onChange={onChange}
                                            id={`morning-${index}`}
                                        />
                                    </div>
                                );
                            })}
                        </form>
                    </>}
            </div>
            <div className="office-space__info">
                <Button child="Book" onClick={() => (GetData())} />
            </div>
        </div>
    );
}

interface DeskClusterComponentProps {
    clusterId: string;
    desks: { [key: string]: Desk };
    selectDesk: (desk: Desk) => void;
}

function DeskClusterComponent({ clusterId, desks, selectDesk }: DeskClusterComponentProps) {
    return (
        <div className="desk-cluster" id={clusterId.toString()}>
            {Object.keys(desks).map((index) => (
                <DeskComponent desk={desks[index]} selectDesk={selectDesk} key={desks[index].deskId} />
            ))}
        </div>
    );
}

interface DeskComponentProps {
    desk: Desk;
    selectDesk: (desk: Desk) => void;
}

function DeskComponent({ desk, selectDesk }: DeskComponentProps) {
    return (
        <div className="desk" id={desk.deskId.toString()} onClick={() => (selectDesk(desk))}>
            <div className="desk__desk">
                <div className={`desk__chair ${GetDeskState(desk.getState())}`}></div>
            </div>
        </div>
    );
}

function GetDeskState(state: number) {
    switch (state) {
        case 0:
            return "desk__chair--available";
            break;
        case 1:
            return "desk__chair--selected";
            break;
        case 2:
            return "desk__chair--half-booked";
            break;
        case 3:
            return "desk__chair--fully-booked";
            break;
        case 4:
            return "desk__chair--unavailable";
            break;
        default:
            return "";
            break;
    }
}

export default OfficeSpace;
