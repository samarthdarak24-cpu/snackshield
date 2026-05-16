const {Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,LevelFormat, PageBreak, TabStopType, TabStopPosition} = require('docx');
const fs = require('fs');
const BLUE = "1F4E8C";
const LIGHT_BLUE = "D6E4F0";
const YELLOW = "FFF3CD";
const GREEN_BG = "E8F5E9";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

function h1(text) {
return new Paragraph({
heading: HeadingLevel.HEADING_1,
spacing: { before: 360, after: 120 },
children: [new TextRun({ text, bold: true, size: 36, color: BLUE, font: "Arial" })]
});
}

function h2(text) {
return new Paragraph({
heading: HeadingLevel.HEADING_2,
spacing: { before: 240, after: 80 },
children: [new TextRun({ text, bold: true, size: 28, color: "2C3E50", font: "Arial" })]
});
}

function h3(text) {
return new Paragraph({
heading: HeadingLevel.HEADING_3,
spacing: { before: 160, after: 60 },
children: [new TextRun({ text, bold: true, size: 24, color: "34495E", font: "Arial" })]
});
}

function para(text, opts = {}) {
return new Paragraph({
spacing: { before: 60, after: 60 },
children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
});
}

function bullet(text, level = 0) {
return new Paragraph({
numbering: { reference: "bullets", level },
spacing: { before: 40, after: 40 },
children: [new TextRun({ text, size: 22, font: "Arial" })]
});
}

function spacer() {
return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });
}

function pageBreak() {
return new Paragraph({ children: [new PageBreak()] });
}

const children = [];

// COVER PAGE
children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 1440, after: 200 },
children: [new TextRun({ text: "SOFTWARE ENGINEERING", bold: true, size: 56, font: "Arial", color: BLUE })]
}));

children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 100, after: 100 },
children: [new TextRun({ text: "Complete Study Notes", bold: true, size: 36, font: "Arial", color: "555555" })]
}));

children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 80, after: 80 },
children: [new TextRun({ text: "Units 1–4 | Exam Revision Guide", size: 26, font: "Arial", color: "777777" })]
}));

children.push(spacer());

children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 200 },
children: [new TextRun({ text: "Unit 1: Agile Process (Scrum)  |  Unit 2: Requirement Engineering", size: 22, font: "Arial" })]
}));

children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 60 },
children: [new TextRun({ text: "Unit 3: Software Design  |  Unit 4: Structural Modeling with UML", size: 22, font: "Arial" })]
}));

children.push(pageBreak());

// UNIT 1
children.push(h1("UNIT 1: AGILE PROCESS — SCRUM"));
children.push(para("Agile methods are iterative, incremental approaches to software development that embrace changing requirements and emphasize collaboration."));
children.push(spacer());

children.push(h2("1.1 Introduction to Scrum"));
children.push(para("Scrum is an agile, lightweight process for managing and controlling software development in rapidly changing environments."));
children.push(spacer());

children.push(h3("Core Characteristics"));
children.push(bullet("Self-organizing teams with cross-functional skill sets (3–9 people)"));
children.push(bullet("Product progresses in a series of 30-day iterations called 'Sprints'"));
children.push(bullet("Requirements are captured as items in a 'Product Backlog'"));
children.push(bullet("Testing and documentation are ongoing throughout development"));
children.push(bullet("Very short daily meetings (15 minutes) to track progress"));
children.push(bullet("Demos are delivered to customer at the end of each Sprint for feedback"));
children.push(spacer());

children.push(h2("1.2 Scrum Roles"));
children.push(h3("Scrum Master"));
children.push(bullet("Removes impediments blocking the team"));
children.push(bullet("Acts as a buffer between the team and external distractions"));
children.push(bullet("Ensures the process is used as intended"));
children.push(spacer());

children.push(h3("Product Owner"));
children.push(bullet("Represents the stakeholders and is the voice of the customer"));
children.push(bullet("Defines product features and decides release dates"));
children.push(bullet("Writes customer-centric items and prioritizes them"));
children.push(spacer());

children.push(h3("Development Team"));
children.push(bullet("Cross-functional group responsible for delivering product increments"));
children.push(bullet("Includes QA engineers, programmers, UI designers, etc."));
children.push(bullet("Team size: 3–9 people"));
children.push(spacer());

children.push(h2("1.3 The Scrum Process"));
children.push(h3("Sprint"));
children.push(para("A time-boxed iteration of 30 days during which a 'Done', usable, and potentially releasable product increment is created."));
children.push(spacer());

children.push(h3("Sprint Planning Meeting"));
children.push(para("An 8-hour collaborative meeting at the start of each Sprint."));
children.push(bullet("Part 1: Create/review Product Backlog, determine Sprint Goal"));
children.push(bullet("Part 2: Create Sprint Backlog — break down work into tasks"));
children.push(spacer());

children.push(h3("Daily Scrum"));
children.push(para("A 15-minute daily stand-up meeting where every team member answers:"));
children.push(bullet("What did you do since the last Scrum?"));
children.push(bullet("What are you doing until the next Scrum?"));
children.push(bullet("What is stopping you from getting on with your work?"));
children.push(spacer());

children.push(h3("Sprint Review Meeting"));
children.push(para("Held at the end of each Sprint. Completed business functionality is demonstrated to the Product Owner and stakeholders for feedback."));
children.push(spacer());

children.push(h3("Sprint Retrospective Meeting"));
children.push(para("A feedback meeting for the Scrum Team only. Three questions: What should we Start doing? Stop doing? Continue doing?"));
children.push(spacer());

children.push(h2("1.4 Scrum Artifacts"));
children.push(h3("Product Backlog"));
children.push(para("A prioritized list of ALL desired work (features, enhancements, bug fixes) for the project. Owned and managed by the Product Owner."));
children.push(spacer());

children.push(h3("Sprint Backlog"));
children.push(para("A subset of Product Backlog Items selected for the current Sprint. Created only by the Team. Updated daily."));
children.push(spacer());

children.push(h3("Burn Down Charts"));
children.push(para("A visual chart showing the remaining work in a Sprint or release over time. Ideally, the line burns down to zero by Sprint end."));
children.push(spacer());

children.push(pageBreak());

// UNIT 2
children.push(h1("UNIT 2: REQUIREMENT ENGINEERING"));
children.push(para("Requirement Engineering (RE) is the systematic process of gathering, analyzing, documenting, and validating the needs and expectations of stakeholders."));
children.push(spacer());

children.push(h2("2.1 What is Requirement Engineering?"));
children.push(para("RE builds a bridge from system requirements into software design. It examines the context of the work, specific design needs, and priorities for completion."));
children.push(spacer());

children.push(h2("2.2 The Requirement Engineering Process (4 Steps)"));
children.push(bullet("Step 1 — Feasibility Study: Assess if the software can be practically built"));
children.push(bullet("Step 2 — Requirement Gathering: Communicate with clients and end-users"));
children.push(bullet("Step 3 — SRS Creation: Document how the software will interact"));
children.push(bullet("Step 4 — Requirement Validation: Check if requirements are practical and valid"));
children.push(spacer());

children.push(h2("2.3 Requirement Elicitation"));
children.push(para("The process of collecting requirements from users, customers, and stakeholders."));
children.push(spacer());

children.push(h3("Elicitation Techniques"));
children.push(bullet("Interviews — Structured or Unstructured"));
children.push(bullet("Questionnaires — Pre-defined set of objective questions"));
children.push(bullet("Surveys — Query stakeholders about expectations"));
children.push(bullet("Prototyping — Build a UI mockup to help users visualize"));
children.push(bullet("Brainstorming — Informal debate among stakeholders"));
children.push(bullet("Observation — Experts visit client site and observe processes"));
children.push(spacer());

children.push(h2("2.4 Categories of Requirements"));
children.push(h3("Functional Requirements"));
children.push(para("Requirements that define the specific functions, features, and behaviors the software system must provide. They describe WHAT the system does."));
children.push(spacer());

children.push(h3("Non-Functional Requirements"));
children.push(para("Requirements that define system properties and constraints. They describe HOW WELL the system performs."));
children.push(para("Examples: Security, Performance, Reliability, Portability, Maintainability, Cost, Accessibility."));
children.push(spacer());

children.push(h2("2.5 Software Requirement Specification (SRS)"));
children.push(para("A document capturing a complete description of how the system is expected to perform. Acts as a contract between client and developer."));
children.push(spacer());

children.push(h3("Properties of a Good SRS"));
children.push(para("CORRECT, PRECISE, UNAMBIGUOUS, COMPLETE, VERIFIABLE, CONSISTENT, UNDERSTANDABLE, MODIFIABLE, TRACEABLE, DESIGN INDEPENDENT, CONCISE, ANNOTATED, PRIORITIZED"));
children.push(spacer());

children.push(h2("2.6 Use Case Diagrams"));
children.push(para("A behavioral UML diagram that captures the functional requirements of a system by showing how users (actors) interact with the system."));
children.push(spacer());

children.push(h3("Core Components"));
children.push(bullet("Actor — External entity (user, external system) that interacts with the system"));
children.push(bullet("Use Case — A class of functionality provided by the system"));
children.push(bullet("System Boundary — Rectangle separating the actors from use cases"));
children.push(spacer());

children.push(h3("Relationships"));
children.push(bullet("Association — Solid line connecting actor to use case"));
children.push(bullet("Generalization — Solid line with hollow triangle"));
children.push(bullet("<<extend>> — Dashed arrow TO base case (optional behavior)"));
children.push(bullet("<<include>> — Dashed arrow FROM base case (shared behavior)"));
children.push(spacer());

children.push(pageBreak());

// UNIT 3
children.push(h1("UNIT 3: SOFTWARE DESIGN"));
children.push(para("Software design is the process of transforming user requirements into a detailed, structured blueprint before coding begins."));
children.push(spacer());

children.push(h2("3.1 What is Software Design?"));
children.push(para("The process of converting the requirements described in the SRS into a structured plan that developers can implement."));
children.push(spacer());

children.push(h3("Why Software Design Matters"));
children.push(bullet("Reduces Cost and Risk — Finding design flaws early is far cheaper"));
children.push(bullet("Enhances Maintainability — Modular design makes it easy to adapt"));
children.push(bullet("Enables Team Coordination — Provides a clear blueprint"));
children.push(bullet("Ensures Quality — Meets non-functional requirements"));
children.push(spacer());

children.push(h2("3.2 High-Level Design (HLD)"));
children.push(para("An initial step where the overall structure and architecture of a system is planned."));
children.push(spacer());

children.push(h3("Components of HLD"));
children.push(bullet("System Architecture — Overview of entire system structure"));
children.push(bullet("Modules and Components — System broken into parts"));
children.push(bullet("Data Flow Diagrams (DFDs) — Show how information moves"));
children.push(bullet("Interface Design — APIs for integration and UIs"));
children.push(bullet("Technology Stack — Programming languages, frameworks, databases"));
children.push(spacer());

children.push(h2("3.3 Low-Level Design (LLD)"));
children.push(para("Transforms high-level abstract concepts into detailed, actionable components."));
children.push(spacer());

children.push(h2("3.4 SOLID Principles"));
children.push(para("Five design guidelines for writing scalable, flexible, and maintainable code:"));
children.push(spacer());

children.push(bullet("S — Single Responsibility Principle: One class, one reason to change"));
children.push(bullet("O — Open/Closed Principle: Open for extension, closed for modification"));
children.push(bullet("L — Liskov's Substitution Principle: Subclasses substitutable for base classes"));
children.push(bullet("I — Interface Segregation Principle: No forced interface implementation"));
children.push(bullet("D — Dependency Inversion Principle: Depend on abstractions, not concretions"));
children.push(spacer());

children.push(h2("3.5 Fundamental Design Concepts"));
children.push(h3("Abstraction"));
children.push(para("Hiding internal implementation details to reduce complexity."));
children.push(spacer());

children.push(h3("Modularity"));
children.push(para("Subdividing a system into smaller, self-contained parts that can be created independently."));
children.push(spacer());

children.push(h3("Information Hiding"));
children.push(para("Exposing only necessary information through controlled interfaces."));
children.push(spacer());

children.push(h3("Functional Independence"));
children.push(para("Designing modules to perform a single, specific task with minimal interaction."));
children.push(para("Achieved through HIGH COHESION and LOW COUPLING."));
children.push(spacer());

children.push(h3("Refactoring"));
children.push(para("Changing a software system's internal structure without altering its external behavior."));
children.push(spacer());

children.push(h2("3.6 Architectural Styles"));
children.push(bullet("Data-Centered Architecture: Centralized data store shared by clients"));
children.push(bullet("Data Flow Architecture: System viewed as transformations on successive data"));
children.push(bullet("Call-and-Return Architecture: Hierarchical decomposition with single thread"));
children.push(bullet("Object-Oriented Architecture: Components are objects with encapsulated data"));
children.push(bullet("Layered Architecture: Organized into layers providing services to layer above"));
children.push(spacer());

children.push(h2("3.7 User Interface (UI) Design"));
children.push(para("The systematic process of creating intuitive, visual, and interactive elements."));
children.push(spacer());

children.push(h3("The Golden Rules of UI Design"));
children.push(bullet("1. Place the User in Control"));
children.push(bullet("2. Reduce the User's Memory Load"));
children.push(bullet("3. Make the Interface Consistent"));
children.push(spacer());

children.push(h2("3.8 Design Patterns"));
children.push(para("A reusable solution to a common software design problem."));
children.push(spacer());

children.push(h3("Three Categories"));
children.push(bullet("Creational Patterns: Abstract Factory, Factory Method, Prototype, Singleton"));
children.push(bullet("Structural Patterns: Adapter, Facade, Proxy"));
children.push(bullet("Behavioral Patterns: Command, Mediator, Observer"));
children.push(spacer());

children.push(pageBreak());

// UNIT 4
children.push(h1("UNIT 4: STRUCTURAL MODELING USING UML"));
children.push(para("UML (Unified Modeling Language) is the industry-standard graphical language for specifying, visualizing, constructing, and documenting software systems."));
children.push(spacer());

children.push(h2("4.1 Object-Oriented Modeling (OOM) Basics"));
children.push(h3("Key OOP Concepts"));
children.push(bullet("Object: A real-world entity with a unique identity, state, and behavior"));
children.push(bullet("Class: A blueprint or template for creating objects"));
children.push(bullet("Encapsulation: Bundling data and methods together while restricting access"));
children.push(bullet("Inheritance: Creating new classes that inherit from existing ones"));
children.push(bullet("Polymorphism: Different objects responding to the same message differently"));
children.push(spacer());

children.push(h2("4.2 What is Modeling?"));
children.push(para("Creating abstract representations of a software system to serve as blueprints."));
children.push(spacer());

children.push(h3("Types of Models"));
children.push(bullet("Class Model (Structure) — Static structure; classes, attributes, operations"));
children.push(bullet("State Model (Dynamic) — How objects change over time"));
children.push(bullet("Interaction Model (Behavior) — How objects collaborate"));
children.push(spacer());

children.push(h2("4.3 UML Overview"));
children.push(para("Unified Modeling Language — an industry-standard graphical language."));
children.push(spacer());

children.push(h3("Types of UML Diagrams"));
children.push(bullet("Structural: Class, Object, Component, Deployment, Package"));
children.push(bullet("Behavioral: Activity, State Machine, Use Case"));
children.push(bullet("Interaction: Sequence, Communication, Interaction Overview, Timing"));
children.push(spacer());

children.push(h2("4.4 Class Diagrams"));
children.push(para("A structural UML diagram that models the static structure of an application."));
children.push(spacer());

children.push(h3("Class Representation"));
children.push(para("Each class is a rectangle with THREE compartments:"));
children.push(bullet("1. Name — Class name"));
children.push(bullet("2. Attributes — Data/properties"));
children.push(bullet("3. Operations — Methods/behaviors"));
children.push(spacer());

children.push(h3("Visibility Modifiers"));
children.push(bullet("+ (plus sign) = Public"));
children.push(bullet("# (hash sign) = Protected"));
children.push(bullet("- (minus sign) = Private"));
children.push(spacer());

children.push(h3("OO Relationships in Class Diagrams"));
children.push(bullet("Association: General connection between two classes (solid line)"));
children.push(bullet("Generalization: 'is-a' relationship (solid line with hollow triangle)"));
children.push(bullet("Aggregation: 'has-a' weak relationship (hollow diamond)"));
children.push(bullet("Composition: Strong 'part-of' relationship (filled diamond)"));
children.push(spacer());

children.push(h3("Multiplicity"));
children.push(bullet("1 — Exactly one"));
children.push(bullet("1* or 1..* — One or more"));
children.push(bullet("0* or 0..* — Zero or more"));
children.push(bullet("x..y — Between x and y (inclusive)"));
children.push(spacer());

children.push(h2("4.5 Object Diagrams"));
children.push(para("A static UML diagram showing a snapshot of the system at a particular moment in time."));
children.push(para("Objects are shown as rectangles with format: objectName : ClassName (underlined)"));
children.push(spacer());

children.push(h2("4.6 Component Diagrams"));
children.push(para("A structural UML diagram showing the organization and wiring of physical components."));
children.push(spacer());

children.push(h3("Key Symbols"));
children.push(bullet("Component — A logical unit block of the system"));
children.push(bullet("Interface — Describes operations used or created by components"));
children.push(bullet("Dependency — Dashed arrow between components"));
children.push(bullet("Port — Square along the edge of a component"));
children.push(bullet("Artifact — Physical files or data deployed on nodes"));
children.push(bullet("Node — Physical or virtual execution environment"));
children.push(spacer());

children.push(h2("4.7 Deployment Diagrams"));
children.push(para("A structural UML diagram showing the physical deployment of software components on hardware nodes."));
children.push(spacer());

children.push(h3("Key Notations"));
children.push(bullet("Nodes — Physical hardware entities (servers, workstations, routers)"));
children.push(bullet("Components — Software modules deployed on nodes"));
children.push(bullet("Artifacts — Physical files representing implementation"));
children.push(bullet("Interface — Point of interaction between components"));
children.push(spacer());

children.push(pageBreak());

// SUMMARY
children.push(h1("📝 QUICK SUMMARY"));
children.push(spacer());

children.push(h2("Unit 1: Scrum"));
children.push(bullet("Agile framework with 30-day Sprints"));
children.push(bullet("Three roles: Scrum Master, Product Owner, Development Team"));
children.push(bullet("Four meetings: Sprint Planning, Daily Scrum, Sprint Review, Retrospective"));
children.push(bullet("Three artifacts: Product Backlog, Sprint Backlog, Burn Down Charts"));
children.push(spacer());

children.push(h2("Unit 2: Requirement Engineering"));
children.push(bullet("Process: Feasibility → Gathering → SRS → Validation"));
children.push(bullet("Functional requirements = WHAT; Non-functional = HOW WELL"));
children.push(bullet("MoSCoW prioritization: Must, Should, Could, Won't"));
children.push(bullet("Use Case Diagrams show actor-system interactions"));
children.push(spacer());

children.push(h2("Unit 3: Software Design"));
children.push(bullet("HLD = architecture; LLD = detailed implementation"));
children.push(bullet("SOLID principles for scalable code"));
children.push(bullet("High Cohesion + Low Coupling = Good Design"));
children.push(bullet("Design Patterns: Creational, Structural, Behavioral"));
children.push(spacer());

children.push(h2("Unit 4: UML"));
children.push(bullet("OOP: Object, Class, Encapsulation, Inheritance, Polymorphism"));
children.push(bullet("Class Diagram: Name, Attributes, Operations"));
children.push(bullet("Relationships: Association, Generalization, Aggregation, Composition"));
children.push(bullet("Other diagrams: Object, Component, Deployment"));
children.push(spacer());

children.push(new Paragraph({
alignment: AlignmentType.CENTER,
spacing: { before: 360, after: 120 },
children: [new TextRun({ text: "— Good Luck with Your Exam! 🎯 —", bold: true, size: 24, font: "Arial", color: BLUE })]
}));

// BUILD DOCUMENT
const doc = new Document({
numbering: {
config: [{
reference: "bullets",
levels: [{
level: 0,
format: LevelFormat.BULLET,
text: "•",
alignment: AlignmentType.LEFT,
style: { paragraph: { indent: { left: 720, hanging: 360 } } }
}]
}]
},
sections: [{
properties: {
page: {
size: { width: 12240, height: 15840 },
margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
}
},
children
}]
});

Packer.toBuffer(doc).then(buffer => {
fs.writeFileSync('SE_Study_Notes.docx', buffer);
console.log('✅ Document created: SE_Study_Notes.docx');
}).catch(err => {
console.error('❌ Error:', err);
process.exit(1);
});
