import "./App.css";

import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { EditMode } from "./EditMode";
import { ReportMenu } from "./ReportMenu";


function App() {
    const [reports, setReports] = useState([]);
    const [currentReportId, setCurrentReportId] = useState(null);

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
            <Row className="pb-3">
                <Col><h1>Sortable App</h1></Col>
            </Row>
            {currentReportId == null ? <ReportMenu reports={reports} setCurrentReportId={setCurrentReportId} /> : <EditMode currentReportId={currentReportId}/>}
        </Container>
    );
}

export default App;
