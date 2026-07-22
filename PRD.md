# PRD — QuestionPro Communities Agent

## Overview

**Product:** QuestionPro Communities Agent
**What it does:** Helps a Community Manager describe, review, approve, deploy, and monitor workflows that act on community members.
**Primary user:** Community Manager
**Existing product area:** Community Admin

The prototype is frontend-only. It uses mock data and must not implement backend APIs, authentication, databases, synchronization, or production integrations.

## Key Entities

- Workflow
- Survey
- Response
- Discussion
- Topic
- Poll
- Member
- Saved segment
- Invitation
- Reward

## Workflow Safety and Approval Rules

- The agent may ask one simple follow-up question at a time when a request is missing important information.
- The agent must not send invitations, assign rewards, change member information, assign members to a study, or start a workflow before the Community Manager reviews and approves the plan.
- Before approval, show **Save Draft**. Do not show **Publish** or **Hold**.
- After approval, show **Publish**.
- Show **Hold** only after a workflow has been published or scheduled.
- For a manual workflow, use **Approve and Run**. Approval starts it immediately.
- For a scheduled workflow, use **Approve and Publish**. Approval activates it but waits for the scheduled date and time.
- Publishing a scheduled workflow does not run it immediately.
- This prototype uses one final Community Manager approval. It does not use multi-level approval.

## Routes

| Destination | Route |
|---|---|
| Community Admin home | `/community-admin` |
| Agent Home | `/community-admin/agent` |
| Proposed Plan | `/community-admin/agent/plan` |
| Member Selection | `/community-admin/agent/members` |
| Approval Screen | `/community-admin/agent/approval` |
| Workflow Progress | `/community-admin/agent/progress` |
| Results Screen | `/community-admin/agent/results` |
| Activity History | `/community-admin/agent/history` |

The local Agent Home URL is `http://localhost:3000/community-admin/agent`.

---

## Screens and Flows

### Agent Home

**URL:** `/community-admin/agent`
**Purpose:** Provide a chat-style workspace where the Community Manager explains what they want the agent to do and answers any required follow-up questions.
**Information shown:** The conversation, the original request, agent follow-up questions, suggested prompts, workflow state, and deployment settings when relevant.

**Buttons available:**

- **Send** while composing or answering a question
- **Back**
- **Save Draft** before approval
- **Publish** after approval
- **Hold** only after publication or scheduling
- **Resume** when a workflow is held

**Button behavior:**

- **Send:** Submit the message. If important information is missing, stay on Agent Home and ask one simple follow-up question, such as “Which member segment should I use?” If the request contains everything needed, begin generating Proposed Plan.
- **Back:** Return to Community Admin home at `/community-admin`.
- **Save Draft:** Open the deployment settings modal. Saving stores the workflow as a draft.
- **Publish:** Deploy an approved workflow. A manual workflow starts only through **Approve and Run**. A scheduled workflow remains scheduled until its date and time.
- **Hold:** Place a published or scheduled workflow on hold so no new runs start.
- **Resume:** Open a confirmation. Confirming returns the workflow to its previous published or scheduled state.

**Deployment settings modal:**

- Buttons: **Save Draft**, **Save and Publish**, and **Cancel**.
- Disable **Save and Publish** until the workflow is approved.
- Frequency choices: Manual, Once, Daily, Weekly, and Monthly.
- **Save Draft:** Save without publishing and show “Workflow saved as a draft.”
- **Save and Publish:** Save and publish an approved workflow using its selected trigger and frequency.
- **Cancel:** Close the modal without changing the saved or deployment state.

**Next screen:** Stay on Agent Home while information is missing. Move to Proposed Plan when the request contains enough information. Back returns to Community Admin home.
**Loading state:** Show a progress bar while the agent processes a submitted chat message.
**Empty state:** Before the first message, show clickable suggested prompts. Clicking one places it into the request flow:

- “Invite members from a saved segment to take a survey.”
- “Assign rewards to members who completed the latest survey.”
- “Re-engage inactive members with a discussion invitation.”
- “Create a recurring poll for active community members.”

**Success states:**

- When enough information is available: “Your plan is ready to review.” Do not mention Save or Publish because Publish is unavailable before approval.
- Draft saved: “Workflow saved as a draft.”
- Held: “Workflow placed on hold. No new runs will start.”

**Error states:**

- Request processing: “We couldn’t process your request right now. Please try again or edit your request.” Keep the original message in the input. Show **Try Again** to resubmit it and **Edit Request** to edit it.
- Save failure: “We couldn’t save this workflow. Your changes are still here. Please try again.”
- Publish failure: “We couldn’t publish this workflow. Nothing was started. Please try again.”

**Approval requirements:** No consequential action may run from Agent Home before final approval. **Save and Publish** remains disabled before approval. Resuming an unchanged held workflow requires confirmation but not full reapproval.

---

### Proposed Plan

**URL:** `/community-admin/agent/plan`
**Purpose:** Show the steps the agent proposes before it performs any action.
**Information shown for each step:**

- Step number
- Step name
- Short description
- Action the agent will perform
- Members or data affected
- Expected result
- Whether approval is required
- Any warning or important condition

**Buttons available:** Continue, Edit Request, and Cancel. When no plan can be created, show Edit Request, Try Again, and Cancel.
**Button behavior:**

- **Continue:** Move to Member Selection when selection is required; otherwise move directly to Approval Screen.
- **Edit Request:** Return to Agent Home with the original request preserved for editing.
- **Try Again:** Attempt to generate the plan again.
- **Cancel:** Return to Agent Home, preserve the original request, perform no action, and show “Plan cancelled. No changes were made.”

**Member Selection decision:** Member Selection is required when a workflow sends invitations, assigns rewards, changes member information or status, assigns members to a study, or targets a group. It may be skipped for read-only requests, report-only requests, requests that affect no members, or workflows containing an approved and locked saved segment.
**Next screen:** Member Selection when required; otherwise Approval Screen. Edit Request and Cancel return to Agent Home.
**Loading state:** Use the existing QuestionPro/WickUI loading component as a subtle progress animation with three moving dots. Show “Creating your plan…” and “We’re reviewing your request and preparing the steps for you.” Do not show a percentage because completion time is unknown. Keep Edit Request and Cancel available, disable Continue, and perform no workflow action. If generation takes longer than expected, show “This is taking a little longer than expected.”
**Empty state:** Show “We couldn’t create a plan from this request.” with Edit Request, Try Again, and Cancel.
**Success state:** Show “Your plan is ready to review.” and enable Continue.
**Error state:** Show “We couldn’t create your plan right now. Please try again or edit your request.” Show Try Again only after failure.
**Approval requirements:** Proposed Plan cannot start a workflow. Final Community Manager approval is still required.

---

### Member Selection

**URL:** `/community-admin/agent/members`
**Purpose:** Let the Community Manager select a saved segment, apply filters, and review or adjust affected members.
**Information shown:** Saved segments, filters, total selected count, and a checkbox table with member name, member ID, email address, verification status, member status, saved segment, last active date, points balance, eligibility status, and reason for ineligibility when applicable.

**Prototype saved segments:**

- All Active Members
- Inactive for 30+ Days
- New Members — Last 30 Days
- Highly Engaged Members
- Low Engagement Members
- Reward-Eligible Members

**Filters:** Verification status, member status, last active date, join date, engagement level, saved segment, study participation status, reward eligibility, points balance, and profile fields such as region, age group, or language.
**Buttons available:** Back to Plan, Clear Selection, Continue to Approval, and Cancel. Member rows include checkboxes. Empty results show Clear Filters and Back to Plan.
**Button behavior:**

- **Back to Plan:** Return to Proposed Plan while preserving selected members and filters.
- **Clear Selection:** Clear all selected member checkboxes while retaining the current filters.
- **Continue to Approval:** Save the selection and move to Approval Screen without executing any action.
- **Cancel:** Cancel the current flow, perform no action, and return to Agent Home with the original request preserved.
- **Clear Filters:** Remove all filters and refresh the eligible-member list.
- Member checkboxes add or remove individual members and update the selected count.

**Next screen:** Continue to Approval moves to Approval Screen. Back returns to Proposed Plan. Cancel returns to Agent Home.
**Loading state:** Show table skeletons or a loading animation with “Loading eligible members…”
**Empty state:** Show “No members match these filters.” with Clear Filters and Back to Plan.
**Success state:** Show “{selected count} members selected.” using the actual count.
**Error state:** Show “We couldn’t load members. Please try again.” with a retry action.
**Approval requirements:** Member Selection needs no separate approval. The final Approval Screen includes the selected members.

---

### Approval Screen

**URL:** `/community-admin/agent/approval`
**Purpose:** Let the Community Manager review the final action, selected members, invitations, rewards, and schedule before granting the one required approval.
**Information shown:** A snapshot of the plan, selected members, invitation content, reward settings, schedule or trigger, high-impact warnings, and Edit links for each relevant section.

**Buttons available:**

- Manual workflow: Approve and Run, Back to Edit, and Cancel
- Scheduled workflow: Approve and Publish, Back to Edit, and Cancel
- Empty state: Back to Plan and Cancel

**Button behavior:**

- **Approve and Run:** Save the plan snapshot, members, invitation and reward settings, and approver identity and time; then start a manual workflow immediately.
- **Approve and Publish:** Save the same approval snapshot, publish the scheduled workflow, and wait for its scheduled date and time.
- **Back to Edit:** Return to the relevant earlier screen without losing entered settings.
- Section **Edit** links return to the corresponding plan, member, invitation, reward, or schedule editor.
- **Cancel:** Perform no action and return to Agent Home with the original request preserved.

**Next screen:** Successful approval moves directly to Workflow Progress. A scheduled workflow appears there with status Scheduled.
**Loading state:** Show “Approving workflow…” and disable the approval button while processing.
**Empty state:** Show “There are no pending actions to approve.” with Back to Plan and Cancel.
**Success state:** Show “Workflow approved successfully.” before moving to Workflow Progress.
**Error state:** Show “We couldn’t approve this workflow. Nothing was started. Please try again.” Keep all review data and allow retry.
**Approval requirements:** Require the checkbox “I have reviewed the actions, selected members, invitations and rewards.” before enabling approval. Show a high-impact warning for large member groups or high reward values, but still require only one final Community Manager approval.

---

### Workflow Progress

**URL:** `/community-admin/agent/progress`
**Purpose:** Show execution or scheduling status for every workflow step.
**Information shown:** Each step, relevant details, and one status: Pending, In Progress, Completed, Failed, Needs Attention, Paused, Cancelled, or Scheduled.

**Buttons available:**

- While running: Pause Workflow, Cancel Workflow, and View Details
- Failed step: Retry Step, View Error Details, and Contact Support
- Needs Attention: Review Issue, Resolve and Continue, and Cancel Workflow
- After processing: View Results

**Button behavior:**

- **Pause Workflow:** Open a confirmation modal. Confirming stops the next pending step but does not undo completed steps.
- **Cancel Workflow:** Open a confirmation modal. Confirming stops all remaining steps but does not undo completed steps.
- **View Details:** Show expanded workflow and step details.
- **Retry Step:** Retry the failed step without offering Skip Step.
- **View Error Details:** Show the affected item and failure information.
- **Contact Support:** Open a support modal populated with sample information. Do not send a real support request.
- **Review Issue:** Show the missing information or decision.
- **Resolve and Continue:** Apply the resolution and continue when it is not material. If it changes members, rewards, invitations, or planned actions, return to Approval Screen.
- **View Results:** Move to Results Screen after processing finishes.

**Next screen:** Remain on Workflow Progress when processing finishes and reveal View Results. Material changes during issue resolution return to Approval Screen.
**Loading state:** Before progress is available, show “Preparing your workflow…”
**Empty state:** If no workflow steps are available, show the overall failure state and provide access to details or Agent Home.
**Success state:** Show “Workflow completed successfully.” and View Results.
**Error state:** Show “The workflow could not be completed. Review the failed step and try again.” Failed steps expose Retry Step, View Error Details, and Contact Support.
**Approval requirements:** A normal run needs no additional approval. Any resolution that materially changes members, rewards, invitations, or planned actions must return to Approval Screen.

**Contact Support modal:** Show sample workflow name, failed step, error message, error reference number, and date and time. Show these buttons:

- **Copy Error Details:** Copy the displayed sample error information.
- **Open Support Page:** Open the support page without automatically submitting a request.
- **Close:** Close the modal and return to Workflow Progress.

The prototype must not send a real support request.

**Status definitions:** Failed means a step attempted to run and did not succeed. Needs Attention means processing is waiting for a Community Manager decision or missing information.

---

### Results Screen

**URL:** `/community-admin/agent/results`
**Purpose:** Summarize a workflow outcome and expose individual failures.
**Information shown:** Members processed, invitations sent, rewards assigned, successful action count, failed action count, overall result type, and each failed member or item with its failure reason.

**Buttons available:** Back to Agent Home, View Activity History, Download Summary, and Retry Failed Actions when failures exist. Each failed action also has Retry.
**Button behavior:**

- **Back to Agent Home:** Return to Agent Home.
- **View Activity History:** Move to Activity History.
- **Download Summary:** Generate and download a PDF containing the workflow name, original request, plan summary, approval details, members affected, actions completed, successful and failed counts, error summary, and completion date and time. CSV export may be considered later for detailed member-level results but is not part of this prototype.
- **Retry Failed Actions:** Retry unchanged failed actions with the same members and settings.
- Individual **Retry:** Retry that unchanged failed action.
- If retry settings, members, rewards, invitations, or actions change, return to Approval Screen instead of executing.

**Next screen:** The Community Manager may go to Agent Home, Activity History, or Approval Screen when a retry contains material changes.
**Loading state:** Show result-summary skeletons while result data is loading.
**Empty state:** Show “No result data is available for this workflow.” with Back to Agent Home and View Activity History.
**Success states:**

- Complete Success: “Your task has been successfully executed.”
- Partial Success: “Workflow completed with some issues. Review and retry the failed actions.”
- Failed: “This workflow failed and no remaining actions were completed. Review the errors and try again.”

**Error state:** If results cannot be loaded, retain navigation actions and show a retry option without changing workflow data.
**Approval requirements:** Retrying the exact same failed action with unchanged members and settings needs no new approval. Material changes return to Approval Screen.

---

### Activity History

**URL:** `/community-admin/agent/history`
**Purpose:** Show previous workflows and let the Community Manager inspect or reuse them safely.
**Information shown for each record:** Workflow name, original request summary, trigger type, created by, created date, last run date, current status, members affected, invitation or reward summary, successful action count, and failed action count.

**Search, filters, and sorting:** Search by workflow name or request; filter by status, trigger type, or date; sort by newest, oldest, or last run date.
**Buttons and row actions:** View Results, Duplicate, Run Again, Resume when held, Archive, and Delete Draft only for drafts that have never run. The empty state has Create Your First Workflow.
**Button behavior:**

- Selecting a completed or failed record or clicking **View Results** opens Results Screen.
- Selecting a draft opens that draft workflow.
- Selecting a running workflow opens Workflow Progress.
- **Duplicate:** Create an editable copy that must be approved before publication or execution.
- **Run Again:** Send a completed manual workflow to Approval Screen before execution.
- **Resume:** Ask for confirmation, then return an unchanged held workflow to its prior published or scheduled state.
- **Archive:** Remove the workflow from the active history view without permanently deleting its completed history.
- **Delete Draft:** Confirm and delete only a draft that has never run.
- **Create Your First Workflow:** Move to Agent Home.

**Next screen:** Results Screen for completed or failed workflows, the draft editor for drafts, Workflow Progress for running workflows, Approval Screen for Run Again, or Agent Home for a new workflow.
**Loading state:** Show table skeletons with “Loading workflow history…”
**Empty state:** Show “No workflows have been created yet.” with Create Your First Workflow.
**Success state:** Successfully displaying the workflow list is the success state; no separate message is required.
**Error state:** Show “We couldn’t load workflow history. Please try again.” with a retry action.
**Approval requirements:** Viewing, duplicating, and archiving need no approval. Resuming an unchanged held workflow requires confirmation but not full approval. Run Again returns to Approval Screen. A duplicate must be approved before it can be published or run. Completed workflow history cannot be permanently deleted.

---

## Terminology

| Term | Definition |
|---|---|
| Community Manager | The person using the agent to create, review, approve, and monitor workflows. |
| Community Admin | The name of the existing QuestionPro product area; it is not the user role name. |
| Workflow | A set of one or more connected steps that the agent performs to complete a Community Manager’s request. |
| Saved segment | A reusable group of members created using saved filters or eligibility rules. |
| Manually triggered | A workflow that starts only when the Community Manager clicks Run or Approve and Run. |
| Autonomous | A workflow that starts automatically using an approved schedule or condition. It operates only within the actions, members, and limits approved by the Community Manager. |
| Reward | Points, vouchers, or another approved incentive provided to an eligible member after a defined action or completion event. |
| Invitation | A message sent to a member inviting them to participate in a study, task, activity, or workflow. |
| Failed | A workflow step attempted to run and did not succeed. |
| Needs Attention | Processing is paused because information, a decision, or corrective action is required from the Community Manager. It is not the same as Failed. |
