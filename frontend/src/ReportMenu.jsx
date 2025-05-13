import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Pencil, Trash } from "react-bootstrap-icons";


export function ReportMenu({reports, setCurrentReportId, setIsEditMode, setReports}) {
    const onEdit = (reportId) => () => {
        setCurrentReportId(reportId);
        setIsEditMode(true);
    };
    const onDelete = (reportId) => () => {
        const endpoint = `/api/reports/${reportId}`;
        fetch(endpoint, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                setReports((prev) => [...prev].filter((report) => report.id !== reportId));
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return <Row>
        <Col>
            {reports.map((report) => <>
                <Card body className="p-0 mb-3" key={report.id}>
                    <Row>
                        <Col md="auto">
                            <Button 
                                onClick={onEdit(report.id)}
                            >
                                <Pencil />
                            </Button>
                        </Col>
                        <Col className="d-flex align-items-center border-end">
                            {report.display_name}
                        </Col>
                        <Col className="d-flex align-items-center">
                            {"Report"}
                        </Col>
                        <Col md="auto">
                            <Button 
                                variant="danger"
                                onClick={onDelete(report.id)}
                            >
                                <Trash />
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </>)}
            {reports.length <= 0 ? <p>{"No reports yet"}</p> : null}
        </Col>
    </Row>;
}
