import { useEffect, useMemo,useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Trash } from "react-bootstrap-icons";
import { ReactSortable } from "react-sortablejs";


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

    const onSubmit = () => {
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
            <Row className="text-start mb-3">
                <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                        {"Add Column"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            filteredReportOptions.map(
                                (option) => (
                                    <Dropdown.Item 
                                        key={option.column}
                                        onClick={() => (
                                            setSelectedOptions((prev) => (
                                                [
                                                    ...prev, 
                                                    {
                                                        column: option.column, 
                                                        selected_name: option.display_name,
                                                    },
                                                ]
                                            ))
                                        )}
                                    >
                                        {option.display_name}
                                    </Dropdown.Item>
                                ),
                            )
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <Row>
                <ReactSortable list={selectedOptions} setList={setSelectedOptions}>
                    {selectedOptions.map((option, index) => (
                        <Card body className="p-0 mb-3" key={option.column}>
                            <Row>
                                <Col className="d-flex align-items-center border-end">
                                    <Form.Control
                                        name={option.column}
                                        type="text"
                                        value={option.selected_name} 
                                        onChange={(e) => setSelectedOptions((prev) => {
                                            const copy = [...prev];
                                            copy[index].selected_name = e.target.value;
                                            return copy;
                                        })} 
                                    />
                                </Col>
                                <Col className="d-flex align-items-center">
                                    {option.column in reportOptionsMap ? reportOptionsMap[option.column].display_name : "Loading..."}
                                </Col>
                                <Col md="auto">
                                    <Button 
                                        variant="danger"
                                        onClick={() => {
                                            setSelectedOptions((prev) => {
                                                const copy = [...prev];
                                                copy.splice(index, 1);
                                                return copy;
                                            });
                                        }}
                                    >
                                        <Trash />
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </ReactSortable>
            </Row>
            <Row>
                <Col>
                    <Button
                        type="submit"
                        onClick={onSubmit}
                    >
                        {"Save"}
                    </Button>
                </Col>
            </Row>
        </>
    );
}
