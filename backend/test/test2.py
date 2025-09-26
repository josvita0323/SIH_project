from app.summarizer import summarize_and_store


content = """
Project Proposal: Project 'Nexus'
Date: September 26, 2025
Prepared For: The Executive Director
Prepared By: Project Management Office

1.0 Executive Summary
Project 'Nexus' is a proposal for a comprehensive upgrade of our current fleet
management and logistics software. The existing system has become a bottleneck,
leading to operational inefficiencies and increased maintenance overhead. This
initiative aims to deploy a state-of-the-art, integrated platform that will enhance fleet
availability, streamline supply chain operations, and improve safety compliance.
Successful implementation requires a coordinated effort between several key
departments. The Frontline Operations Manager (Rolling Stock) will be the primary
stakeholder, supported directly by the Procurement Officer for vendor management
and the HR & Safety Coordinator for personnel training and protocol updates. This
document outlines the project scope, departmental responsibilities, and the proposed
timeline for approval by the Executive Director.
"""

actionable_line = "Deploy a state-of-the-art integrated platform to enhance fleet availability."

relevant_department = "rolling_stock_operations"

summarize_and_store(1, actionable_line, content, relevant_department)
