import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Save } from "react-bootstrap-icons";


export function EditSubmit({selectedOptions, displayName, currentReportId, setCurrentReportId, setReports, setIsEditMode}) {
    const onSubmit = () => {
        if (selectedOptions.length <= 0) {
            return;
        }
        const endpoint = currentReportId == null ? "/api/reports" : `/api/reports/${currentReportId}`;
        fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                display_name: displayName,
                selected_options: selectedOptions,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                if (currentReportId == null) {
                    setReports((prev) => [...prev, data]);
                } else {
                    setReports((prev) => {
                        const copy = [...prev];
                        (copy.find((report) => report.id === currentReportId) || {}).display_name = displayName;
                        return copy;
                    });
                    setCurrentReportId(null);
                }
                setIsEditMode(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Row className="text-start mt-2 mb-4">
            <Col>
                <Button
                    variant="secondary"
                    type="submit"
                    onClick={onSubmit}
                >
                    <Save className="me-2" />
                    {"Save"}
                </Button>
            </Col>
        </Row>
    );
}
