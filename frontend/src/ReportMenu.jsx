import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Pencil } from "react-bootstrap-icons";


export function ReportMenu({reports, setCurrentReportId}) {
    return <Row>
        <Col>
            {reports.map((report) => <>
                <Card body className="p-0 mb-3" key={report.id}>
                    <Row>
                        <Col md="auto">
                            <Button onClick={() => setCurrentReportId(report.id)}>
                                <Pencil />
                            </Button>
                        </Col>
                        <Col className="d-flex align-items-center border-end">
                            {report.display_name}
                        </Col>
                        <Col className="d-flex align-items-center">
                            {report.category}
                        </Col>
                    </Row>
                </Card>
            </>)}
        </Col>
    </Row>;
}
