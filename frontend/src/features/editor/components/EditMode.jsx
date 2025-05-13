import { useEffect, useMemo,useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Back } from "react-bootstrap-icons";

import { EditDropdown } from "./EditDropdown";
import { EditSortable } from "./EditSortable";


export function EditMode({currentReportId, setCurrentReportId, setIsEditMode, setReports}) {
    const [reportOptions, setReportOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [displayName, setDisplayName] = useState("");

    const reportOptionsMap = useMemo(() => reportOptions.reduce((acc, item) => {
        acc[item.column] = item;
        return acc;
    }, {}), [reportOptions]);
    const filteredReportOptions = useMemo(() => {
        const selectedOptionsByName = selectedOptions.map((option) => option.column);
        return reportOptions.filter((option) => !selectedOptionsByName.includes(option.column));
    }, [reportOptions, selectedOptions]);

    useEffect(() => {
        fetch("/api/reports/options")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setReportOptions(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (currentReportId == null) {
            return;
        }
        fetch(`/api/reports/${currentReportId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setDisplayName(data.display_name);
                setSelectedOptions(data.selected_options);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentReportId]);

    const onBack = () => {
        setCurrentReportId(null);
        setIsEditMode(false);
    };

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
        <>
            <Row className="text-start mb-3">
                <Col>
                    <Button
                        variant="secondary"
                        onClick={onBack}
                    >
                        <Back className="me-2" />
                        {"Back"}
                    </Button>
                </Col>
            </Row>
            <Row className="text-start mb-3">
                <Form.Group className="mb-3">
                    <Form.Label>{"Report Name"}</Form.Label>
                    <Form.Control
                        name="report_name"
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter report name"
                        required
                    />
                </Form.Group>
            </Row>
            {filteredReportOptions.length > 0 ? <EditDropdown
                filteredReportOptions={filteredReportOptions}
                setSelectedOptions={setSelectedOptions}
            /> : null}
            {reportOptions.length > 0 && selectedOptions.length > 0 ? <EditSortable
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                reportOptionsMap={reportOptionsMap}
            /> : null}
            {selectedOptions.length > 0 ? <>
                <Row className="text-start">
                    <Col>
                        <Button
                            variant="secondary"
                            type="submit"
                            onClick={onSubmit}
                        >
                            {"Save"}
                        </Button>
                    </Col>
                </Row>
            </> : null}
        </>
    );
}
