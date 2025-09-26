departments = [
    {
        "title": "Rolling Stock Operations",
        "name": "rolling_stock_operations",
        "description": (
            "Responsible for the availability, safety, and reliability of trains and depots. "
            "Deals with engineering drawings, maintenance job cards, incident reports, and IoT condition monitoring data. "
            "Front-line managers rely on this department for quick access to actionable insights on train readiness, "
            "shift planning, and safety compliance."
        )
    },
    {
        "title": "Procurement",
        "name": "procurement",
        "description": (
            "Manages vendor contracts, spare parts, and services essential for metro operations. "
            "Handles purchase orders, vendor invoices, and procurement correspondence. "
            "Needs visibility into engineering design changes and maintenance requirements "
            "to avoid misaligned contracts and ensure timely availability of critical supplies."
        )
    },
    {
        "title": "HR & Safety",
        "name": "hr_safety",
        "description": (
            "Ensures employee well-being, workforce training, and compliance with safety regulations. "
            "Manages HR policies, safety circulars, and incident reports while coordinating refresher training "
            "based on the latest directives from safety authorities. "
            "Plays a key role in bridging human capital readiness with operational safety."
        )
    },
    {
        "title": "Executive Management",
        "name": "executive_management",
        "description": (
            "Provides strategic leadership, governance, and regulatory compliance oversight. "
            "Engages with board meeting minutes, legal opinions, regulatory directives, "
            "and financial compliance reports. "
            "Ensures cross-departmental alignment, institutional knowledge retention, and timely decision-making "
            "for corridor expansion, depot integration, and new technology adoption."
        )
    }
]


def get_department_by_name(name: str):
    for dept in departments:
        if dept["name"] == name:
            return dept
    return None
