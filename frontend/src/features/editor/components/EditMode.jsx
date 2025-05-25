import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Back, Trash } from "react-bootstrap-icons";

import { EditDropdown } from "./EditDropdown";
import { EditSortable } from "./EditSortable";
import { EditSubmit } from "./EditSubmit";


export function EditMode({currentReportId, setCurrentReportId, setIsEditMode, setReports, reportOptions, selectedOptions, setSelectedOptions, displayName, setDisplayName, onBack, onDelete}) {
    const filteredReportOptions = useMemo(() => {
        const selectedOptionsByName = selectedOptions.map((option) => option.column);
        return reportOptions.filter((option) => !selectedOptionsByName.includes(option.column));
    }, [reportOptions, selectedOptions]);

    return (
        <>
            <Row className="mb-4">
                <Col className="text-start">
                    <Button
                        variant="secondary"
                        onClick={onBack}
                    >
                        <Back className="me-2" />
                        {"Back"}
                    </Button>
                </Col>
                {currentReportId !== null ? <Col className="text-end">
                    <Button
                        variant="danger"
                        onClick={onDelete}
                        aria-label="Delete Report"
                    >
                        <Trash/>
                    </Button>
                </Col> : null}
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
                reportOptions={reportOptions}
            /> : null}
            {selectedOptions.length > 0 ? <>
                <EditSubmit
                    selectedOptions={selectedOptions}
                    displayName={displayName}
                    currentReportId={currentReportId}
                    setCurrentReportId={setCurrentReportId}
                    setReports={setReports}
                    setIsEditMode={setIsEditMode}
                />
            </> : null}
        </>
    );
}
