import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ReactSortable } from "react-sortablejs";


export function EditSortable({selectedOptions, setSelectedOptions, reportOptionsMap}) {
    return (
        <Row>
            <Col>
                <ReactSortable list={selectedOptions} setList={setSelectedOptions}>
                    {selectedOptions.map((option, index) => (
                        <div key={option.column}>
                            <Card body className="p-0 mb-3">
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
                                        {reportOptionsMap[option.column].display_name}
                                    </Col>
                                    <Col md="auto" className="d-flex align-items-center">
                                        <CloseButton
                                            variant="danger"
                                            onClick={() => {
                                                setSelectedOptions((prev) => {
                                                    const copy = [...prev];
                                                    copy.splice(index, 1);
                                                    return copy;
                                                });
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    ))}
                </ReactSortable>
            </Col>
        </Row>
    );
}