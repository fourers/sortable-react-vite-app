from flask import Flask

app = Flask(__name__)


@app.route("/api/reports")
def get_reports():
    return [
        {
            "id": 1,
            "display_name": "Report 1",
            "category": "Business",
        },
        {
            "id": 2,
            "display_name": "Report 2",
            "category": "Media",
        },
    ]


@app.route("/api/reports/<int:report_id>")
def get_report(report_id):
    return {
        "report_id": report_id,
        "options": [
            {
                "column_name": "first_name",
                "display_name": "First Name",
            },
            {
                "column_name": "middle_name",
                "display_name": "Middle Name",
            },
            {
                "column_name": "last_name",
                "display_name": "Last Name",
            },
        ],
        "selected": [
            {
                "column_name": "first_name",
                "selected_name": "My First Name",
            }
        ],
    }
