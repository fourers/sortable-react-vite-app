import { useEffect, useState } from "react";

import { EditMode } from "./EditMode";


export function EditModeWrapper({currentReportId, setCurrentReportId, setIsEditMode, setReports}) {
    const [reportOptions, setReportOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [displayName, setDisplayName] = useState("");

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
                setIsEditMode(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <EditMode
            currentReportId={currentReportId}
            setCurrentReportId={setCurrentReportId}
            setIsEditMode={setIsEditMode}
            setReports={setReports}
            reportOptions={reportOptions}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            displayName={displayName}
            setDisplayName={setDisplayName}
            onBack={onBack}
            onDelete={onDelete}
        />
    );
}
