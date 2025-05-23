from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware
from flask import Flask, jsonify, request

from constants import REPORT_COLUMNS
from models import Report, db

flask_app = Flask(__name__)
flask_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///backend.db"
db.init_app(flask_app)

with flask_app.app_context():
    db.create_all()


@flask_app.route("/api/reports/options", methods=["GET"])
def get_options():
    return jsonify(REPORT_COLUMNS)


@flask_app.route("/api/reports", methods=["GET"])
def get_reports():
    reports = db.session.execute(db.select(Report).order_by(Report.id)).scalars().all()
    return jsonify([report.to_json() for report in reports])


@flask_app.route("/api/reports/<int:report_id>", methods=["GET"])
def get_report(report_id):
    report = db.get_or_404(Report, report_id)
    return jsonify(report.to_json())


@flask_app.route("/api/reports", methods=["POST"])
def create_report():
    json_body = request.json
    report = Report(
        display_name=json_body["display_name"],
        selected_options=json_body["selected_options"],
    )
    db.session.add(report)
    db.session.commit()
    return jsonify(report.to_json())


@flask_app.route("/api/reports/<int:report_id>", methods=["POST"])
def update_report(report_id):
    json_body = request.json
    report = db.get_or_404(Report, report_id)
    report.display_name = json_body["display_name"]
    report.selected_options = json_body["selected_options"]
    db.session.commit()
    return jsonify(report.to_json())


@flask_app.route("/api/reports/<int:report_id>", methods=["DELETE"])
def delete_report(report_id):
    report = db.get_or_404(Report, report_id)
    db.session.delete(report)
    db.session.commit()
    return jsonify(report.to_json())


app = FastAPI()
app.mount("/", WSGIMiddleware(flask_app))
