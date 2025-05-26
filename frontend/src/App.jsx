import "./App.css";

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

import { Heading } from "./components/Heading";
import { EditModeWrapper } from "./pages/EditReport/EditModeWrapper";
import { ReportMenu } from "./pages/ListReports/ReportMenu";


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
            {!isEditMode ? <ReportMenu
                reports={reports}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            /> : null}
            {isEditMode ? <EditModeWrapper
                currentReportId={currentReportId}
                setCurrentReportId={setCurrentReportId}
                setIsEditMode={setIsEditMode}
                setReports={setReports}
            /> : null}
        </Container>
    );
}

export default App;
