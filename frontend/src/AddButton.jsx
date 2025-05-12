import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


export function AddButton({setCurrentReportId, setIsEditMode}) {
    return (
        <Row className="mb-3">
            <Col>
                <Button
                    onClick={() => {
                        setIsEditMode(true);
                        setCurrentReportId(null);
                    }}
                >
                    {"Add Report"}
                </Button>
            </Col>
        </Row>
    );
}
