import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Trash } from "react-bootstrap-icons";
import { ReactSortable } from "react-sortablejs";


export function EditMode({currentReportId}) {
    const [reportOptions, setReportOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const reportOptionsMap = reportOptions.reduce((acc, item) => {
        acc[item.column_name] = item;
        return acc;
    }, {});
    const selectedOptionsByName = selectedOptions.map((option) => option.column_name);
    const filteredReportOptions = reportOptions.filter(
        (option) => !selectedOptionsByName.includes(option.column_name),
    );

    useEffect(() => {
        fetch(`/api/reports/${currentReportId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setReportOptions(data.options);
                setSelectedOptions(data.selected);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentReportId]);

    return (
        <>
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
                                        key={option.column_name}
                                        onClick={() => (
                                            setSelectedOptions((prev) => (
                                                [
                                                    ...prev, 
                                                    {
                                                        column_name: option.column_name, 
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
                        <Card body className="p-0 mb-3" key={option.column_name}>
                            <Row>
                                <Col className="d-flex align-items-center border-end">
                                    <Form.Control
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
                                    {reportOptionsMap[option.column_name].display_name}
                                </Col>
                                <Col md="auto">
                                    <Button>
                                        <Trash />
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </ReactSortable>
            </Row>
        </>
    );
}
