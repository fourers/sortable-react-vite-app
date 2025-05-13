import "./App.css";

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

import { AddButton } from "./AddButton";
import { EditMode } from "./features/editor/components/EditMode";
import { Heading } from "./Heading";
import { ReportMenu } from "./ReportMenu";


function App() {
    const [reports, setReports] = useState([]);
    const [currentReportId, setCurrentReportId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetch("/api/reports")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setReports(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Container>
            <Heading />
            {isEditMode ? null : <AddButton 
                setCurrentReportId={setCurrentReportId} 
                setIsEditMode={setIsEditMode}
            />}
            {isEditMode ? null: <ReportMenu
                reports={reports}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
            />}
            {isEditMode ? <EditMode
                currentReportId={currentReportId}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            /> : null}
        </Container>
    );
}

export default App;
