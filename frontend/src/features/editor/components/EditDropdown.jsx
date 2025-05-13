import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import { PlusSquare } from "react-bootstrap-icons";


export function EditDropdown({filteredReportOptions, setSelectedOptions}) {
    return (
        <Row className="text-start mb-3">
            <Col>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary">
                        <PlusSquare className="me-2" />
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
            </Col>
        </Row>
    );
}