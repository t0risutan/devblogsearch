# IPA Documentation Checklist

---

## A01 — Project order analysis & method choice

- [ ] Project order analysed and documented with a suitable method (goal structure, use-case/context diagram, or requirements table)
- [ ] That analysis is visibly used to track project goals throughout the report
- [ ] A project method was selected and documented
- [ ] The choice of method is justified in writing

---

## A02 — Information research

- [ ] Missing, IPA-relevant information was identified and systematically researched
- [ ] Common knowledge is not repeated at length — only gaps filled
- [ ] All AI-generated or externally sourced content is clearly declared
- [ ] Researched info is credible, current, and valid (sources noted)

---

## A03 — Information presentation & use

- [ ] Documentation is clear and well-structured
- [ ] Suitable visuals used where relevant (diagrams, charts, tables)
- [ ] An external specialist could fully understand the project from the docs alone
- [ ] All information is relevant to the project — nothing off-topic

---

## A04 — Time plan

- [ ] Time plan is part of Part 1 of the IPA report
- [ ] Time plan is clearly laid out
- [ ] Structure matches the chosen project method
- [ ] Date-based timeline with reasonable granularity (e.g. hour blocks) is defined
- [ ] Activities are logical and sensibly ordered
- [ ] Official IPA time allocation is correctly reflected

---

## A05 — Progress & risk tracking

- [ ] Progress checked regularly and clearly documented throughout
- [ ] Planned vs actual schedule compared (Soll/Ist)
- [ ] Risks and problems reviewed periodically — written proof exists
- [ ] Unmet goals and corrective measures described (or explicitly stated as not applicable)

---

## A06 — Performance

- [ ] Project goals consistently pursued; priorities recognised and acted on
- [ ] Tasks handled efficiently; output meets standards of an IT professional
- [ ] Work quality and professionalism meets IT professional standards

---

## A07 — Independent work

- [ ] Goals and tasks pursued independently
- [ ] Problem-solving shown; obstacles overcome alone or with appropriate help
- [ ] Self-motivation and high engagement demonstrated
- [ ] Self-reflection shown in the documentation

---

## A08 — Technical language

- [ ] Correct technical vocabulary used consistently throughout
- [ ] Technical content is precisely worded and accurately conveyed
- [ ] Writing is logically structured so an external specialist can follow

---

## A09 — Technical competency

- [ ] Theoretical knowledge visibly applied in practice
- [ ] Information and facts critically analysed to reach sound conclusions
- [ ] Skills applied to unexpected or novel situations (transfer performance)
- [ ] Methods and tools chosen to match the project method and used effectively

---

## A10 — Team interaction

- [ ] Input from clients, experts, or team members captured and documented
- [ ] Feedback and requirements implemented and evidenced in the report
- [ ] Communication with stakeholders documented (project or collaboration tool logs)

---

## A11 — Project org chart

- [ ] All roles relevant to the chosen method are identified
- [ ] Roles correctly and clearly described
- [ ] Project org structure shown graphically (e.g. org chart) with correct dependencies
- [ ] Included in Part 1 of the IPA report

---

## A12 — Testing (shared requirements)

- [ ] Test infrastructure and environment described — a third party could reproduce results
- [ ] Potential improvements and rework identified (or stated as not applicable with reasoning)

### linear method:
- [ ] Test scenarios and components documented with expected results
- [ ] Tests conducted per those scenarios; results clearly documented

---

## G05 — UI prototyping & validation

- [ ] Key functions/flows shown with prototypes (wireframes, mockups, or clickable models)
- [ ] Prototypes used to verify usability, information flow, and design — documented
- [ ] Feedback from stakeholders or testers gathered and incorporated — documented
- [ ] Final interfaces are clear, consistent, and follow usability/design principles

---

## G06 — Security

- [ ] Relevant security risks systematically identified and documented
- [ ] System environment analysed for security weaknesses
- [ ] Appropriate security measures specified and implemented — documented
- [ ] Results and planned measures agreed with stakeholders — documented

---

## G11 — Implementation & versioning

- [ ] Back-end and front-end follows defined requirements, languages, tools, and security guidelines — documented
- [ ] Regular checks of implementation against all requirements documented
- [ ] Coding guidelines verified; code readability and traceability ensured — documented
- [ ] All changes committed to version control following company rules — documented

---

## G13 — Test execution & evaluation

- [ ] Suitable test environment set up per test concept; automated test cases implemented
- [ ] Tests thoroughly executed; protocol and traceability carefully documented
- [ ] Test results systematically evaluated; failed cases identified, corrective actions initiated
- [ ] Implementation verified against security concept; deviations addressed

---

## G16 — Error handling & logging

- [ ] Comprehensive error handling covers expected and unexpected errors without harming UX — documented
- [ ] try/catch (or equivalent) in place; errors systematically logged — documented
- [ ] Robust logging system used: timestamps, messages, context — structured for debugging
- [ ] Documentation describes error-handling approach including logging and notification methods

---

## Git

- [ ] Commits scoped to a single feature; commit messages describe it concisely
- [ ] Commit messages in imperative style (present tense: "add …", not "added …")
- [ ] Development on a dev branch, merged to main once per day

---

## Code style

- [ ] Variable names clearly describe their purpose
- [ ] Comments used where needed; omitted where code is self-explanatory
- [ ] Code consistently formatted throughout (indentation, quotes, etc.)

---

## Data fetching

- [ ] Error responses and non-2xx status codes properly handled
- [ ] async/await used correctly throughout
- [ ] Received data cleanly parsed and validated (unexpected/empty results handled)

---

## Helix/Milo framework

- [ ] Web component concepts and lifecycle correctly implemented
- [ ] CSS styling uses proper encapsulation and shadow DOM
- [ ] Modern JS and CSS features used correctly without external frameworks

---

## Filter state management

- [ ] Filter state persists across page refresh
- [ ] Multiple filters can be combined correctly per the spec
- [ ] Filters extracted correctly from query index; empty filter groups not shown